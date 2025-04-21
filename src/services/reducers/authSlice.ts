import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  loginUserApi,
  registerUserApi,
  logoutApi,
  getUserApi,
  updateUserApi,
  refreshToken // Импортируем готовую функцию refreshToken
} from '../../utils/burger-api';
import { TUser } from '../../utils/types';
import { setCookie, getCookie, deleteCookie } from '../../utils/cookie';
import { RootState } from '../types';

type IAuthState = {
  user: TUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
};

const initialState: IAuthState = {
  user: null,
  accessToken: getCookie('accessToken') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
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

// Запрос на обновление токена с использованием функции refreshToken
export const refreshTokenThunk = createAsyncThunk<
  { accessToken: string; refreshToken: string },
  void,
  { rejectValue: string }
>('auth/refreshToken', async (_, { rejectWithValue }) => {
  try {
    const refreshData = await refreshToken(); // Используем готовую функцию из burger-api
    return {
      accessToken: refreshData.accessToken,
      refreshToken: refreshData.refreshToken
    };
  } catch (err) {
    return rejectWithValue('Ошибка обновления токена');
  }
});

// Запрос на выход из системы
export const logoutUserThunk = createAsyncThunk<
  null,
  void,
  { rejectValue: string }
>('auth/logoutUser', async (_, { rejectWithValue }) => {
  try {
    await logoutApi();
    return null;
  } catch (err) {
    return rejectWithValue('Ошибка выхода из системы');
  }
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
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Обновление токена
      .addCase(refreshTokenThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshTokenThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
      })
      .addCase(refreshTokenThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        deleteCookie('accessToken');
        localStorage.removeItem('refreshToken');
      })

      // Выход из системы
      .addCase(logoutUserThunk.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.accessToken = null;
        state.refreshToken = null;
        deleteCookie('accessToken');
        localStorage.removeItem('refreshToken');
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
export const selectRefreshToken = (state: RootState) => state.auth.refreshToken;

export default authSlice.reducer;
