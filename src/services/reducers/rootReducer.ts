import { combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from './ingredientsSlice';
import orderReducer from './orderSlice';
import authReducer from './authSlice';
import feedReducer from './feedSlice';
import constructorReducer from './constructorSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  order: orderReducer,
  auth: authReducer,
  feed: feedReducer,
  constructor: constructorReducer
});

export type RootState = ReturnType<typeof rootReducer>;
