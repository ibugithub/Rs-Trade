import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './auth/authSlice';
import { cartReducer } from './cart/cartSlice';
import { addressReducer } from './addresses/addressSlice';
import { catalogReducer } from './catalog/catalogSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      cart: cartReducer,
      addresses: addressReducer,
      catalog: catalogReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
