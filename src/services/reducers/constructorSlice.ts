import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient, TConstructorIngredient } from '../../utils/types';
import { RootState } from '../store';

interface TConstructorState {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
  buns: TIngredient[];
  mains: TIngredient[];
  sauces: TIngredient[];
  error: string | null;
}

const initialState: TConstructorState = {
  bun: null,
  ingredients: [],
  buns: [],
  mains: [],
  sauces: [],
  error: null
};

const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    setBun: (state, action: PayloadAction<TIngredient | null>) => {
      state.bun = action.payload;
    },
    addIngredient: (state, action: PayloadAction<TConstructorIngredient>) => {
      if (!state) {
        if (action.payload.type === 'bun') {
          return { ...initialState, bun: action.payload };
        }
        return {
          ...initialState,
          ingredients: [
            {
              ...action.payload,
              uniqueId: `${action.payload._id}-${Date.now()}`
            }
          ]
        };
      }
      if (action.payload.type === 'bun') {
        state.bun = action.payload;
      } else {
        if (!state.ingredients) {
          state.ingredients = [];
        }
        state.ingredients = [
          ...state.ingredients,
          { ...action.payload, uniqueId: `${action.payload._id}-${Date.now()}` }
        ];
      }
    },
    removeIngredient: (state, action: PayloadAction<number>) => {
      state.ingredients = state.ingredients.filter(
        (_, index) => index !== action.payload
      );
    },
    setIngredients: (state, action: PayloadAction<TIngredient[]>) => {
      state.buns = action.payload.filter((ing) => ing.type === 'bun');
      state.mains = action.payload.filter((ing) => ing.type === 'main');
      state.sauces = action.payload.filter((ing) => ing.type === 'sauce');
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;
      const ingredients = state.ingredients;

      if (
        fromIndex >= 0 &&
        fromIndex < ingredients.length &&
        toIndex >= 0 &&
        toIndex < ingredients.length
      ) {
        const [ingredientToMove] = state.ingredients.splice(fromIndex, 1);
        state.ingredients.splice(toIndex, 0, ingredientToMove);
      }
    }
  }
});

export const {
  setBun,
  addIngredient,
  removeIngredient,
  setIngredients,
  clearConstructor,
  moveIngredient
} = constructorSlice.actions;

export const selectBun = (state: RootState) => state.constructor.bun;
export const selectIngredients = (state: RootState) =>
  state.constructor.ingredients;
export const selectBuns = (state: RootState) => state.constructor.buns;
export const selectMains = (state: RootState) => state.constructor.mains;
export const selectSauces = (state: RootState) => state.constructor.sauces;
export const selectError = (state: RootState) => state.constructor.error;
export const selectConstructor = (state: RootState) => state.constructor;

export default constructorSlice.reducer;
