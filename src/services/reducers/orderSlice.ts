import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getOrdersApi,
  orderBurgerApi,
  getOrderByNumberApi
} from '../../utils/burger-api';
import { TOrder } from '../../utils/types';
import { RootState } from '../store';

type IOrderState = {
  order: TOrder | null; // Текущий заказ
  ordersData: TOrder[] | null; // Массив заказов
  loadingOrder: boolean; // Загрузка заказа
  loadingOrders: boolean; // Загрузка списка заказов
  error: string | null; // Текст ошибки
  isOrderModalOpen: boolean;
};

// Начальное состояние стора для заказов
const initialState: IOrderState = {
  order: null,
  ordersData: null,
  loadingOrder: false,
  loadingOrders: false,
  error: null,
  isOrderModalOpen: false
};

// Запрос на создание заказа
export const createOrderThunk = createAsyncThunk<
  TOrder,
  string[],
  { rejectValue: string }
>('order/createOrder', async (ingredients, { rejectWithValue }) => {
  try {
    const response = await orderBurgerApi(ingredients);
    return response.order;
  } catch (err) {
    return rejectWithValue('Ошибка создания заказа');
  }
});

// Запрос на получение заказов пользователя
export const fetchOrdersThunk = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('order/fetchOrders', async (_, { rejectWithValue }) => {
  try {
    return await getOrdersApi();
  } catch (err) {
    return rejectWithValue('Ошибка загрузки заказов');
  }
});

// Запрос на получение заказа по номеру.
export const fetchOrderByNumberThunk = createAsyncThunk<
  TOrder,
  number,
  { rejectValue: string }
>('order/fetchOrderByNumber', async (orderNumber, { rejectWithValue }) => {
  try {
    const response = await getOrderByNumberApi(orderNumber);
    if (!response.orders || response.orders.length === 0) {
      return rejectWithValue('Заказ не найден');
    }
    return response.orders[0];
  } catch (err) {
    return rejectWithValue('Ошибка поиска заказа');
  }
});

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    openOrderModal: (state) => {
      state.isOrderModalOpen = true;
    },
    closeOrderModal: (state) => {
      state.isOrderModalOpen = false;
      state.order = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Создание заказа
      .addCase(createOrderThunk.pending, (state) => {
        state.loadingOrder = true;
        state.error = null;
      })
      .addCase(createOrderThunk.fulfilled, (state, action) => {
        state.loadingOrder = false;
        state.order = action.payload;
        state.isOrderModalOpen = true;
      })
      .addCase(createOrderThunk.rejected, (state, action) => {
        state.loadingOrder = false;

        state.error = action.payload || 'Ошибка загрузки заказов';
      })

      // Получение всех заказов
      .addCase(fetchOrdersThunk.pending, (state) => {
        state.loadingOrders = true;
        state.error = null;
      })
      .addCase(fetchOrdersThunk.fulfilled, (state, action) => {
        state.loadingOrders = false;
        state.ordersData = action.payload;
      })
      .addCase(fetchOrdersThunk.rejected, (state, action) => {
        state.loadingOrders = false;

        state.error = action.payload || 'Ошибка загрузки заказов';
      })

      // Поиск заказа по номеру
      .addCase(fetchOrderByNumberThunk.pending, (state) => {
        state.loadingOrder = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumberThunk.fulfilled, (state, action) => {
        state.loadingOrder = false;
        state.order = action.payload;
      })
      .addCase(fetchOrderByNumberThunk.rejected, (state, action) => {
        state.loadingOrder = false;
        state.error = action.payload || 'Ошибка поиска заказа';
      });
  }
});

// Селекторы
export const selectOrders = (state: RootState) => state.order.ordersData;
export const selectCurrentOrder = (state: RootState) => state.order.order;
export const selectLoadingOrders = (state: RootState) =>
  state.order.loadingOrders;
export const selectOrderError = (state: RootState) => state.order.error;
export const selectIsOrderModalOpen = (state: RootState) =>
  state.order.isOrderModalOpen;
export const selectOrderById = (state: RootState, orderId: string) => {
  const order = state.order.order;
  return order &&
    (order._id === orderId || String(order.number) === String(orderId))
    ? order
    : null;
};

export const { openOrderModal, closeOrderModal } = orderSlice.actions;
export default orderSlice.reducer;
