import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '../../utils/types';
import { RootState, AppDispatch } from '../types';

export type TOrdersData = {
  orders: TOrder[];
  total: number;
  totalToday: number;
};

type IFeedState = {
  feed: TOrdersData | null;
  loading: boolean;
  error: string | null;
  wsConnected: boolean;
  pendingOrders: TOrder[];
  reconnectAttempts: number;
};

const initialState: IFeedState = {
  feed: null,
  loading: false,
  error: null,
  wsConnected: false,
  pendingOrders: [],
  reconnectAttempts: 0
};

let ws: WebSocket | null = null;

export const connectFeedWs = createAsyncThunk<
  void,
  string,
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>(
  'feed/connectFeedWs',
  async (url: string, { dispatch, getState, rejectWithValue }) => {
    try {
      const state = getState();
      const { reconnectAttempts } = state.feed;
      const MAX_RECONNECT_ATTEMPTS = 5; // Максимальное количество попыток переподключения
      const BASE_RECONNECT_DELAY = 5000; // Базовая задержка в 5 секунд

      // Если превышено максимальное количество попыток, прекращаем переподключение
      if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
        dispatch(
          feedSlice.actions.wsConnectError('Maximum reconnect attempts reached')
        );
        return rejectWithValue('Maximum reconnect attempts reached');
      }

      // Закрываем существующее соединение, если оно есть
      if (ws) {
        ws.close(1000, 'Normal closure');
        ws = null;
      }

      ws = new WebSocket(url);

      ws.onopen = () => {
        dispatch(feedSlice.actions.wsConnectSuccess());
        dispatch(feedSlice.actions.resetReconnectAttempts()); // Сбрасываем счётчик попыток при успешном подключении
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.success) {
          dispatch(feedSlice.actions.wsMessage(data));
        }
      };

      ws.onerror = (error) => {
        dispatch(feedSlice.actions.wsConnectError('WebSocket error'));
      };

      ws.onclose = (event) => {
        dispatch(feedSlice.actions.wsDisconnect());
        // Если код закрытия не 1000 (нормальное закрытие), пытаемся переподключиться
        if (event.code !== 1000) {
          const delay =
            BASE_RECONNECT_DELAY * Math.pow(2, state.feed.reconnectAttempts); // Экспоненциальная задержка
          dispatch(feedSlice.actions.incrementReconnectAttempts()); // Увеличиваем счётчик попыток
          setTimeout(() => {
            dispatch(connectFeedWs(url));
          }, delay);
        }
      };

      return;
    } catch (error) {
      dispatch(
        feedSlice.actions.wsConnectError('Failed to connect to WebSocket')
      );
      return rejectWithValue('Failed to connect to WebSocket');
    }
  }
);

export const disconnectFeedWs = () => (dispatch: AppDispatch) => {
  if (ws) {
    ws.close(1000, 'Normal closure');
    ws = null;
    dispatch(feedSlice.actions.wsDisconnect());
    dispatch(feedSlice.actions.resetReconnectAttempts());
  }
};

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    wsConnectSuccess: (state) => {
      state.wsConnected = true;
      state.loading = false;
      state.error = null;
    },
    wsConnectError: (state, action) => {
      state.wsConnected = false;
      state.error = action.payload;
      state.loading = false;
    },
    wsDisconnect: (state) => {
      state.wsConnected = false;
    },
    wsMessage: (state, action: PayloadAction<TOrdersData>) => {
      const { orders, total, totalToday } = action.payload;
      const pendingOrdersToAdd = state.pendingOrders.filter(
        (pendingOrder) =>
          !orders.some((order: TOrder) => order._id === pendingOrder._id)
      );
      state.feed = {
        orders: [...pendingOrdersToAdd, ...orders],
        total: total + pendingOrdersToAdd.length,
        totalToday
      };
      state.pendingOrders = pendingOrdersToAdd;
    },
    addOrder: (state, action: PayloadAction<TOrder>) => {
      const newOrder = action.payload;
      if (!state.feed) {
        state.feed = { orders: [newOrder], total: 1, totalToday: 1 };
        state.pendingOrders = [newOrder];
      } else {
        if (!state.feed.orders.some((order) => order._id === newOrder._id)) {
          state.feed.orders = [newOrder, ...state.feed.orders];
          state.feed.total = (state.feed.total || 0) + 1; // Увеличиваем total
          state.feed.totalToday = (state.feed.totalToday || 0) + 1; // Увеличиваем totalToday
          state.pendingOrders = [newOrder, ...state.pendingOrders];
        }
      }
    },
    incrementReconnectAttempts: (state) => {
      state.reconnectAttempts += 1; // Увеличиваем счётчик попыток
    },
    resetReconnectAttempts: (state) => {
      state.reconnectAttempts = 0; // Сбрасываем счётчик попыток
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(connectFeedWs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(connectFeedWs.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(connectFeedWs.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ?? 'Ошибка подключения WebSocket';
      });
  }
});

export const selectFeed = (state: RootState) => state.feed.feed;
export const selectLoadingFeed = (state: RootState) => state.feed.loading;
export const selectFeedError = (state: RootState) => state.feed.error;
export const selectWsConnected = (state: RootState) => state.feed.wsConnected;

export const { addOrder } = feedSlice.actions;
export default feedSlice.reducer;
