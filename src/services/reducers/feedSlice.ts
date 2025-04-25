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
  isConnecting: boolean;
};

const initialState: IFeedState = {
  feed: null,
  loading: false,
  error: null,
  wsConnected: false,
  pendingOrders: [],
  reconnectAttempts: 0,
  isConnecting: false
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
      const MAX_RECONNECT_ATTEMPTS = 5;
      const BASE_RECONNECT_DELAY = 5000;

      if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
        dispatch(
          feedSlice.actions.wsConnectError('Maximum reconnect attempts reached')
        );
        return rejectWithValue('Maximum reconnect attempts reached');
      }

      dispatch(feedSlice.actions.startConnecting());

      // Закрываем существующее соединение, если оно есть
      if (ws) {
        ws.close(1000, 'Normal closure');
        ws = null;
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      ws = new WebSocket(url);

      ws.onopen = () => {
        dispatch(feedSlice.actions.wsConnectSuccess());
        dispatch(feedSlice.actions.resetReconnectAttempts());
        dispatch(feedSlice.actions.stopConnecting());
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.success) {
          dispatch(feedSlice.actions.wsMessage(data));
        }
      };

      ws.onerror = (error) => {
        dispatch(feedSlice.actions.wsConnectError('WebSocket error'));
        dispatch(feedSlice.actions.stopConnecting());
      };

      ws.onclose = (event) => {
        dispatch(feedSlice.actions.wsDisconnect());
        dispatch(feedSlice.actions.stopConnecting());
        if (event.code !== 1000) {
          const delay =
            BASE_RECONNECT_DELAY * Math.pow(2, state.feed.reconnectAttempts);
          dispatch(feedSlice.actions.incrementReconnectAttempts());
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
      dispatch(feedSlice.actions.stopConnecting());
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
    dispatch(feedSlice.actions.stopConnecting());
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
          state.feed.total = (state.feed.total || 0) + 1;
          state.feed.totalToday = (state.feed.totalToday || 0) + 1;
          state.pendingOrders = [newOrder, ...state.pendingOrders];
        }
      }
    },
    incrementReconnectAttempts: (state) => {
      state.reconnectAttempts += 1;
    },
    resetReconnectAttempts: (state) => {
      state.reconnectAttempts = 0;
    },
    startConnecting: (state) => {
      state.isConnecting = true;
    },
    stopConnecting: (state) => {
      state.isConnecting = false;
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
export const selectWsIsConnecting = (state: RootState) =>
  state.feed.isConnecting;
export const { addOrder } = feedSlice.actions;
export default feedSlice.reducer;
