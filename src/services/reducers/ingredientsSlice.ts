import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../../utils/burger-api'; // Импорт API-запроса
import { TIngredient } from '../../utils/types';
import { RootState } from '../store';

type IngredientsState = {
  ingredients: TIngredient[]; // массив ингредиентов
  loading: boolean; // загрузка данных
  error: string | null; // текст ошибки
  loaded: boolean;
};

// начальное состояние стора для ингредиентов
const initialState: IngredientsState = {
  ingredients: [],
  loading: false,
  error: null,
  loaded: false
};

// Асинхронный thunk для запроса ингредиентов
export const fetchIngredientsThunk = createAsyncThunk<
  TIngredient[], // Тип данных, которые получим (массив ингредиентов)
  void, // Аргумент
  { rejectValue: string } // Ошибка, если запрос провалился
>('ingredients/fetchIngredients', async (_, { rejectWithValue }) => {
  try {
    return await getIngredientsApi();
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : 'Ошибка при получении ингредиентов';
    return rejectWithValue(errorMessage);
  }
});

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState: {
    ...initialState,
    selectedIngredient: null as TIngredient | null
  },
  reducers: {
    setSelectedIngredient(state, action) {
      state.selectedIngredient = action.payload;
    },
    clearSelectedIngredient(state) {
      state.selectedIngredient = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredientsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIngredientsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.loaded = true;
        // Добавляем проверку, чтобы избежать перезаписи данных, если они не изменились
        if (
          state.ingredients.length !== action.payload.length ||
          !state.ingredients.every(
            (ingredient, index) => ingredient._id === action.payload[index]._id
          )
        ) {
          state.ingredients = action.payload;
        }
      })
      .addCase(fetchIngredientsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === 'string'
            ? action.payload
            : 'Ошибка загрузки';
      });
  }
});

export const selectIngredients = (state: RootState) =>
  state.ingredients.ingredients;
export const selectLoadingIngredients = (state: RootState) =>
  state.ingredients.loading;
export const selectIngredientsError = (state: RootState) =>
  state.ingredients.error;
export const selectIngredientsLoaded = (state: RootState) =>
  state.ingredients.loaded;
export const selectSelectedIngredient = (state: RootState) =>
  state.ingredients.selectedIngredient;
export const selectIngredientById = (id: string) => (state: RootState) =>
  state.ingredients.ingredients.find((item) => item._id === id);

export const { setSelectedIngredient, clearSelectedIngredient } =
  ingredientsSlice.actions;
export default ingredientsSlice.reducer;
