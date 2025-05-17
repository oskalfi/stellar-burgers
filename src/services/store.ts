import { combineSlices, configureStore } from '@reduxjs/toolkit';
import { ingredientsSlice } from './slices/ingredientsSlice';
import { userOrdersSlice } from './slices/userOrdersSlice';
import { allOrdersSlice } from './slices/allOrdersSlice';
import { userAuthSlice } from './slices/userAuthSlice';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

const rootReducer = combineSlices(
  ingredientsSlice,
  userOrdersSlice,
  allOrdersSlice,
  userAuthSlice
);

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;
