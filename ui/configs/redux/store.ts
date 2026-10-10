import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './auth/authSlice';
import { cartReducer } from './cart/cartSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      cart: cartReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
