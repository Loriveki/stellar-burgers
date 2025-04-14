import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './reducers/rootReducer';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

const initialConstructorState = {
  bun: null,
  ingredients: [],
  buns: [],
  mains: [],
  sauces: [],
  error: null
};

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
    })
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
