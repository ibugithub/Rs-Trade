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
const { demoSubtotal, formatBDT } = load('content/pricing.ts');
const addresses = load('configs/redux/addresses/addressSlice.ts');
const navigation = load('lib/orderNavigation.ts');
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
test('request summary labels demo prices and keeps final confirmation explicit', () => {
  const summary = formatOrderRequest([{ productId: 'trimmer', quantity: 3 }], {
    name: ' Buyer ',
    phone: '+880123',
    address: 'Dhaka',
    notes: 'Confirm packaging',
  });
  assert.match(summary, /Multi-purpose Grooming Kit: 3 requested/);
  assert.match(summary, /BDT 1,250 per unit, demo price/);
  assert.match(summary, /Demo subtotal: BDT 3,750 \(preview only; not a final quote\)/);
  assert.match(summary, /Name: Buyer/);
  assert.match(summary, /Phone \/ WhatsApp: \+880123/);
  assert.match(summary, /Confirm packaging/);
  assert.match(summary, /Please confirm availability, MOQ, final price and delivery charges/);
  assert.doesNotMatch(summary, /\$|payment successful|order confirmed/i);
});

test('demo totals follow quantities and removal without delivery charges', () => {
  let state = cart.cartReducer(empty(), cart.addItem({ productId: 'trimmer', quantity: 2 }));
  state = cart.cartReducer(state, cart.addItem({ productId: 'speaker', quantity: 1 }));
  assert.equal(demoSubtotal(state.items), 6000);
  state = cart.cartReducer(state, cart.setQuantity({ productId: 'trimmer', quantity: 3 }));
  assert.equal(demoSubtotal(state.items), 7250);
  state = cart.cartReducer(state, cart.removeItem('speaker'));
  assert.equal(demoSubtotal(state.items), 3750);
  assert.equal(demoSubtotal([]), 0);
  assert.equal(formatBDT(3750), 'BDT 3,750');
});

const owner = 'buyer@example.com';
const home = {
  id: 'home',
  label: 'Home',
  recipient: 'Buyer',
  phone: '+880123',
  street: 'House 1, Road 2',
  city: 'Dhaka',
  postalCode: '1207',
  country: 'Bangladesh',
};
const office = {
  ...home,
  id: 'office',
  label: 'Office',
  recipient: 'Office recipient',
  street: 'Office Road',
  postalCode: '',
};
const addressState = () =>
  addresses.addressReducer(
    undefined,
    addresses.loadAddresses({ owner, saved: {}, storageAvailable: true }),
  );

test('multiple addresses can be added, edited and chosen as default', () => {
  let state = addressState();
  state = addresses.addressReducer(
    state,
    addresses.saveAddress({ owner, address: home, makeDefault: false }),
  );
  assert.equal(state.defaultId, 'home');
  state = addresses.addressReducer(
    state,
    addresses.saveAddress({ owner, address: office, makeDefault: true }),
  );
  assert.equal(state.items.length, 2);
  assert.equal(state.defaultId, 'office');
  state = addresses.addressReducer(
    state,
    addresses.saveAddress({ owner, address: { ...office, city: 'Sylhet' }, makeDefault: false }),
  );
  assert.equal(state.items.length, 2);
  assert.equal(state.items[1].city, 'Sylhet');
  state = addresses.addressReducer(state, addresses.setDefaultAddress({ owner, id: 'home' }));
  assert.equal(state.defaultId, 'home');
  assert.equal(addresses.selectDeliveryAddress(state.items, null, state.defaultId).id, 'home');
  assert.equal(
    addresses.selectDeliveryAddress(state.items, 'office', state.defaultId).id,
    'office',
  );
});

test('removing the default selects another valid address; removing the last clears it', () => {
  let state = addressState();
  for (const address of [home, office])
    state = addresses.addressReducer(
      state,
      addresses.saveAddress({ owner, address, makeDefault: false }),
    );
  state = addresses.addressReducer(state, addresses.removeAddress({ owner, id: 'home' }));
  assert.equal(state.defaultId, 'office');
  assert.equal(addresses.selectDeliveryAddress(state.items, 'home', state.defaultId).id, 'office');
  state = addresses.addressReducer(state, addresses.removeAddress({ owner, id: 'office' }));
  assert.equal(state.defaultId, null);
  assert.equal(addresses.selectDeliveryAddress(state.items, null, null), null);
});

test('restored addresses reject malformed entries, duplicates and missing defaults', () => {
  const state = addresses.addressReducer(
    undefined,
    addresses.loadAddresses({
      owner,
      storageAvailable: true,
      saved: {
        items: [
          null,
          { ...home, recipient: ' ' },
          home,
          home,
          office,
          { ...home, id: 'bad', phone: 123 },
        ],
        defaultId: 'missing',
      },
    }),
  );
  assert.deepEqual(state.items, [home, office]);
  assert.equal(state.defaultId, 'home');
  assert.equal(addresses.normalizeAddress({ ...home, street: 'a'.repeat(501) }), null);
  assert.equal(addresses.normalizeAddress({ ...home, city: ' Dhaka ' }).city, 'Dhaka');
});

test('account switches and sign-out clear active addresses and reject stale mutations', () => {
  let state = addresses.addressReducer(
    addressState(),
    addresses.saveAddress({ owner, address: home, makeDefault: true }),
  );
  const saved = { items: state.items, defaultId: state.defaultId };
  state = addresses.addressReducer(
    state,
    addresses.loadAddresses({ owner: 'other@example.com', saved: {}, storageAvailable: true }),
  );
  state = addresses.addressReducer(
    state,
    addresses.saveAddress({ owner, address: office, makeDefault: true }),
  );
  assert.deepEqual(state.items, []);
  state = addresses.addressReducer(
    state,
    addresses.loadAddresses({ owner: null, saved, storageAvailable: true }),
  );
  assert.deepEqual(state.items, []);
  assert.equal(state.hydrated, false);
  state = addresses.addressReducer(
    state,
    addresses.loadAddresses({ owner, saved, storageAvailable: true }),
  );
  assert.deepEqual(state.items, [home]);
  assert.notEqual(
    addresses.addressStorageKey(owner),
    addresses.addressStorageKey('other@example.com'),
  );
  assert.equal(
    addresses.addressStorageKey(owner),
    addresses.addressStorageKey(' BUYER@example.com '),
  );
});

test('order summary uses the chosen saved recipient, phone and full address', () => {
  const selected = addresses.selectDeliveryAddress([home, office], 'office', 'home');
  const summary = formatOrderRequest([{ productId: 'trimmer', quantity: 2 }], {
    name: selected.recipient,
    phone: selected.phone,
    address: addresses.formatDeliveryAddress(selected),
    notes: '',
  });
  assert.match(summary, /Name: Office recipient/);
  assert.match(summary, /Delivery address: Office Road, Dhaka, Bangladesh/);
  assert.doesNotMatch(summary, /House 1/);
});

test('checkout and Buy Now wait for hydration, then require sign-in and a saved address', () => {
  for (const path of ['/checkout', '/buy_now']) {
    assert.equal(navigation.orderAddressDestination('idle', false, 0, path), null);
    assert.equal(navigation.orderAddressDestination('loading', false, 0, path), null);
    assert.equal(
      navigation.orderAddressDestination('unauthenticated', false, 0, path),
      '/accounts/signin',
    );
    assert.equal(navigation.orderAddressDestination('authenticated', false, 0, path), null);
    assert.equal(
      navigation.orderAddressDestination('authenticated', true, 0, path),
      navigation.profileAddressPath(path),
    );
    assert.equal(navigation.orderAddressDestination('authenticated', true, 2, path), null);
    assert.equal(navigation.orderReturnPath(`?returnTo=${encodeURIComponent(path)}`), path);
  }
  assert.equal(navigation.orderReturnPath('?returnTo=https://example.com'), null);
  assert.equal(navigation.orderReturnPath('?returnTo=//example.com'), null);
});

test('email and social sign-in return uses only allowed address destinations and is consumed once', () => {
  const memory = new Map();
  global.sessionStorage = {
    getItem: (key) => memory.get(key) ?? null,
    setItem: (key, value) => memory.set(key, value),
    removeItem: (key) => memory.delete(key),
  };
  try {
    navigation.rememberAddressSignIn('/buy_now');
    assert.equal(navigation.consumeSignInReturn(), navigation.profileAddressPath('/buy_now'));
    assert.equal(navigation.consumeSignInReturn(), '/');
    memory.set('rs-trade-sign-in-return', 'https://example.com');
    assert.equal(navigation.consumeSignInReturn(), '/');
    global.sessionStorage = {
      getItem() {
        throw new Error('blocked');
      },
      setItem() {
        throw new Error('blocked');
      },
    };
    assert.doesNotThrow(() => navigation.rememberAddressSignIn('/checkout'));
    assert.equal(navigation.consumeSignInReturn(), '/');
  } finally {
    delete global.sessionStorage;
  }
});
