const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

// Compile the pure TypeScript modules without adding a test runtime dependency.
const cache = new Map();
function load(relative) {
  const filename = path.resolve(__dirname, '..', relative);
  if (cache.has(filename)) return cache.get(filename);
  const module = { exports: {} };
  cache.set(filename, module.exports);
  const source = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const localRequire = (name) =>
    name.startsWith('@/')
      ? load(`${name.slice(2)}.ts`)
      : name.startsWith('.')
        ? load(
            path.relative(
              path.resolve(__dirname, '..'),
              path.resolve(path.dirname(filename), `${name}.ts`),
            ),
          )
        : require(name);
  new Function('require', 'module', 'exports', source)(localRequire, module, module.exports);
  cache.set(filename, module.exports);
  return module.exports;
}
const cart = load('configs/redux/cart/cartSlice.ts');
const { formatOrderRequest } = load('content/orderRequest.ts');
const empty = () => cart.cartReducer(undefined, { type: 'init' });

test('adds merge quantities; update, removal and clear work together', () => {
  let state = empty();
  state = cart.cartReducer(state, cart.addItem({ productId: 'trimmer', quantity: 2 }));
  state = cart.cartReducer(state, cart.addItem({ productId: 'trimmer', quantity: 3 }));
  state = cart.cartReducer(state, cart.addItem({ productId: 'speaker', quantity: 1 }));
  assert.deepEqual(state.items, [
    { productId: 'trimmer', quantity: 5 },
    { productId: 'speaker', quantity: 1 },
  ]);
  state = cart.cartReducer(state, cart.setQuantity({ productId: 'trimmer', quantity: 7 }));
  state = cart.cartReducer(state, cart.removeItem('speaker'));
  assert.equal(state.items[0].quantity, 7);
  assert.deepEqual(cart.cartReducer(state, cart.clearCart()).items, []);
});
test('Buy Now does not replace or add to the cart', () => {
  let state = cart.cartReducer(empty(), cart.addItem({ productId: 'trimmer', quantity: 2 }));
  state = cart.cartReducer(state, cart.setBuyNow({ productId: 'camera', quantity: 4 }));
  assert.deepEqual(state.items, [{ productId: 'trimmer', quantity: 2 }]);
  assert.deepEqual(state.buyNow, { productId: 'camera', quantity: 4 });
});
test('restored storage rejects unknown products and invalid quantities', () => {
  const state = cart.cartReducer(
    empty(),
    cart.hydrateCart({
      items: [
        { productId: 'missing', quantity: 1 },
        { productId: 'trimmer', quantity: -1 },
        { productId: 'trimmer', quantity: 1.5 },
        { productId: 'trimmer', quantity: 2 },
        { productId: 'trimmer', quantity: 3 },
      ],
      buyNow: { productId: 'camera', quantity: 1 },
    }),
  );
  assert.deepEqual(state.items, [{ productId: 'trimmer', quantity: 5 }]);
  assert.equal(state.hydrated, true);
  assert.deepEqual(cart.cartReducer(state, cart.hydrateCart({ items: [] })).items, state.items);
});
test('quantity limits and invalid payloads cannot corrupt selections', () => {
  let state = cart.cartReducer(empty(), cart.addItem({ productId: 'camera', quantity: 999999 }));
  assert.equal(state.items[0].quantity, cart.MAX_QUANTITY);
  state = cart.cartReducer(state, cart.setQuantity({ productId: 'camera', quantity: 0 }));
  assert.equal(state.items[0].quantity, cart.MAX_QUANTITY);
  state = cart.cartReducer(state, cart.addItem({ productId: 'missing', quantity: 1 }));
  assert.equal(state.items.length, 1);
  assert.deepEqual(cart.sanitizeCartItems(null), []);
  assert.deepEqual(
    cart.sanitizeCartItems([null, 'bad', { productId: 'camera', quantity: '3' }]),
    [],
  );
});
test('request summary follows chosen products and quantities without invented prices', () => {
  const summary = formatOrderRequest([{ productId: 'trimmer', quantity: 3 }], {
    name: ' Buyer ',
    phone: '+880123',
    address: 'Dhaka',
    notes: 'Confirm packaging',
  });
  assert.match(summary, /Multi-purpose Grooming Kit: 3 requested/);
  assert.match(summary, /Name: Buyer/);
  assert.match(summary, /Phone \/ WhatsApp: \+880123/);
  assert.match(summary, /Confirm packaging/);
  assert.match(summary, /Please confirm availability, MOQ, final price and delivery charges/);
  assert.doesNotMatch(summary, /\$|payment successful|order confirmed/i);
});
