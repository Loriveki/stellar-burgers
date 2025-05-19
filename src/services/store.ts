import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './reducers/rootReducer';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { tokenMiddleware } from './tokenMiddleware';
import { RootState, AppDispatch } from './types';

// Начальное состояние для constructor
const initialConstructorState = {
  bun: null,
  ingredients: [],
  buns: [],
  mains: [],
  sauces: [],
  error: null
};

// Создаём store
const store = configureStore({
  reducer: rootReducer,
  preloadedState: {
    constructor: initialConstructorState
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'ingredients/fetchIngredients/pending',
          'ingredients/fetchIngredients/fulfilled',
          'constructor/addIngredient'
        ]
      }
    }).prepend(tokenMiddleware)
});

// Типизированные хуки
export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
