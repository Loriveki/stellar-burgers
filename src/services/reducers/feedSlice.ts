import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '../../utils/types';
import { RootState } from '../store';

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
};

const initialState: IFeedState = {
  feed: null,
  loading: false,
  error: null,
  wsConnected: false
};

export const connectFeedWs = createAsyncThunk(
  'feed/connectFeedWs',
  async (url: string, { dispatch, rejectWithValue }) => {
    try {
      const ws = new WebSocket(url);
      ws.onopen = () => {
        dispatch(feedSlice.actions.wsConnectSuccess());
      };
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.success) {
          dispatch(feedSlice.actions.wsMessage(data));
        }
      };
      ws.onerror = () => {
        dispatch(feedSlice.actions.wsConnectError('WebSocket error'));
        rejectWithValue('WebSocket connection failed');
      };
      ws.onclose = () => {
        dispatch(feedSlice.actions.wsDisconnect());
      };
      return; // Ничего не возвращаем в payload
    } catch (error) {
      return rejectWithValue('Failed to connect to WebSocket');
    }
  }
);

const feedSlice = createSlice({
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
    wsMessage: (state, action) => {
      state.feed = {
        orders: action.payload.orders,
        total: action.payload.total,
        totalToday: action.payload.totalToday
      };
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

export default feedSlice.reducer;
