import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  loginUserApi,
  registerUserApi,
  logoutApi,
  getUserApi,
  updateUserApi,
  TAuthResponse
} from '../../utils/burger-api';
import { TUser } from '../../utils/types';
import { setCookie, getCookie, deleteCookie } from '../../utils/cookie';
import { RootState } from '../store';

type IAuthState = {
  user: TUser | null; // Данные о пользователе
  accessToken: string | null; // Токен доступа
  isAuthenticated: boolean; // Статус авторизации
  loading: boolean; // Флаг загрузки
  error: string | null; // Текст ошибки
};

// Начальное состояние для авторизации
const initialState: IAuthState = {
  user: null,
  accessToken: getCookie('accessToken') || null,
  isAuthenticated: false,
  loading: false,
  error: null
};

// Запрос на регистрацию нового пользователя
export const registerUserThunk = createAsyncThunk<
  TUser,
  { email: string; name: string; password: string },
  { rejectValue: string }
>('auth/registerUser', async (registerData, { rejectWithValue }) => {
  try {
    const response = await registerUserApi(registerData);
    return response.user;
  } catch (err) {
    return rejectWithValue('Ошибка регистрации');
  }
});

// Запрос на авторизацию (логин)
export const loginUserThunk = createAsyncThunk<
  TUser,
  { email: string; password: string },
  { rejectValue: string }
>('auth/loginUser', async (loginData, { rejectWithValue }) => {
  try {
    const response = await loginUserApi(loginData);

    const accessToken = response.accessToken;
    const refreshToken = response.refreshToken;
    if (accessToken) {
      setCookie('accessToken', accessToken);
    }

    localStorage.setItem('refreshToken', refreshToken);
    return response.user;
  } catch (err) {
    return rejectWithValue('Ошибка авторизации');
  }
});

// Запрос на выход из системы
export const logoutUserThunk = createAsyncThunk('auth/logoutUser', async () => {
  await logoutApi();
  return null;
});

// Запрос на получение данных пользователя
export const getUserThunk = createAsyncThunk<
  TUser,
  void,
  { rejectValue: string }
>('auth/getUser', async (_, { rejectWithValue }) => {
  try {
    const response = await getUserApi();
    return response.user;
  } catch (err) {
    return rejectWithValue('Ошибка получения данных пользователя');
  }
});

export const updateUserThunk = createAsyncThunk<
  TUser,
  { email: string; name: string; password: string },
  { rejectValue: string }
>('auth/updateUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await updateUserApi(userData);
    return response.user;
  } catch (err) {
    return rejectWithValue('Ошибка обновления данных пользователя');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Регистрация пользователя
      .addCase(registerUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Авторизация пользователя
      .addCase(loginUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        // Сохранение токенов
        const accessToken = getCookie('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');

        // Записываем accessToken в state

        if (accessToken) {
          state.accessToken = accessToken;
        }
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Выход из системы
      .addCase(logoutUserThunk.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;

        // Удаляем токены
        deleteCookie('accessToken');
        localStorage.removeItem('refreshToken');

        state.accessToken = null;
      })

      // Получение данных пользователя
      .addCase(getUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Обновление данных пользователя
      .addCase(updateUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectAccessToken = (state: RootState) => state.auth.accessToken;

export default authSlice.reducer;
