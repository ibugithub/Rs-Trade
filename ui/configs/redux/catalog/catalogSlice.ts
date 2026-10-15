import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ProductCatalog, ReadyStockProduct } from '@/content/readyStock';
import { getSelectedProducts } from '@/lib/catalogApi';

type CatalogState = {
  products: ProductCatalog;
  cartStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  requestId?: string;
};

export const fetchCartProducts = createAsyncThunk(
  'catalog/fetchCartProducts',
  async (ids: string[], { signal }) => getSelectedProducts(ids, signal),
);

const initialState: CatalogState = { products: {}, cartStatus: 'idle' };
const slice = createSlice({
  name: 'catalog',
  initialState,
  reducers: {
    rememberProducts(state, action: PayloadAction<ReadyStockProduct[]>) {
      for (const product of action.payload) state.products[product.id] = product;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchCartProducts.pending, (state, action) => {
      state.cartStatus = 'loading';
      state.requestId = action.meta.requestId;
    });
    builder.addCase(fetchCartProducts.fulfilled, (state, action) => {
      if (state.requestId !== action.meta.requestId) return;
      for (const id of action.meta.arg) delete state.products[id];
      for (const product of action.payload) state.products[product.id] = product;
      state.cartStatus = 'succeeded';
      state.requestId = undefined;
    });
    builder.addCase(fetchCartProducts.rejected, (state, action) => {
      if (state.requestId !== action.meta.requestId) return;
      state.cartStatus = 'failed';
      state.requestId = undefined;
    });
  },
});

export const { rememberProducts } = slice.actions;
export const catalogReducer = slice.reducer;
