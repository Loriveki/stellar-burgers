import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  getOrdersApi,
  orderBurgerApi,
  getOrderByNumberApi
} from '../../utils/burger-api';
import { TOrder } from '../../utils/types';
import { RootState, AppDispatch } from '../types';
import { feedSlice } from '../reducers/feedSlice';

type IOrderState = {
  order: TOrder | null;
  ordersData: TOrder[] | null;
  loadingOrder: boolean;
  loadingOrders: boolean;
  error: string | null;
  isOrderModalOpen: boolean;
  statusUpdates: { [orderId: string]: string };
  newOrderIds: string[];
  wsConnected: boolean;
  reconnectAttempts: number;
};

const initialState: IOrderState = {
  order: null,
  ordersData: null,
  loadingOrder: false,
  loadingOrders: false,
  error: null,
  isOrderModalOpen: false,
  statusUpdates: {},
  newOrderIds: [],
  wsConnected: false,
  reconnectAttempts: 0
};

let ws: WebSocket | null = null;

export const connectOrdersWs = createAsyncThunk<
  void,
  string,
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>(
  'order/connectOrdersWs',
  async (url: string, { dispatch, getState, rejectWithValue }) => {
    try {
      const state = getState();
      const { reconnectAttempts } = state.order;
      const MAX_RECONNECT_ATTEMPTS = 5;
      const BASE_RECONNECT_DELAY = 5000; // Базовая задержка 5 секунд

      // Если превышено максимальное количество попыток, прекращаем переподключение
      if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
        return rejectWithValue('Maximum reconnect attempts reached');
      }

      if (ws) {
        ws.close(1000, 'Normal closure');
        ws = null;
      }

      ws = new WebSocket(url);

      ws.onopen = () => {
        dispatch(orderSlice.actions.wsConnectSuccess());
        dispatch(orderSlice.actions.resetReconnectAttempts()); // Сбрасываем счётчик попыток
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.success) {
          dispatch(orderSlice.actions.wsMessage(data));
        }
      };

      ws.onerror = (error) => {
        dispatch(orderSlice.actions.wsConnectError('WebSocket error'));
      };

      ws.onclose = (event) => {
        dispatch(orderSlice.actions.wsDisconnect());
        if (event.code !== 1000) {
          // Код 1000 — нормальное закрытие
          const delay =
            BASE_RECONNECT_DELAY * Math.pow(2, state.order.reconnectAttempts); // Экспоненциальная задержка
          dispatch(orderSlice.actions.incrementReconnectAttempts());
          setTimeout(() => {
            dispatch(connectOrdersWs(url));
          }, delay);
        }
      };

      return;
    } catch (error) {
      return rejectWithValue('Failed to connect to WebSocket');
    }
  }
);

export const disconnectOrdersWs = () => (dispatch: AppDispatch) => {
  if (ws) {
    ws.close(1000, 'Normal closure');
    ws = null;
    dispatch(orderSlice.actions.wsDisconnect());
    dispatch(orderSlice.actions.resetReconnectAttempts()); // Сбрасываем счётчик при явном отключении
  }
};

export const createOrderThunk = createAsyncThunk<
  TOrder,
  string[],
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>('order/createOrder', async (ingredients, { rejectWithValue, dispatch }) => {
  try {
    const response = await orderBurgerApi(ingredients);
    const order = response.order;
    dispatch({
      type: 'feed/addOrder',
      payload: { ...order, status: 'created' }
    });
    dispatch(startOrderStatusUpdate(order._id));
    dispatch(addNewOrderWithTimeout(order._id));
    return order;
  } catch (err) {
    return rejectWithValue('Ошибка создания заказа');
  }
});

export const fetchOrdersThunk = createAsyncThunk<
  TOrder[],
  void,
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>('order/fetchOrders', async (_, { rejectWithValue }) => {
  try {
    return await getOrdersApi();
  } catch (err) {
    return rejectWithValue('Ошибка загрузки заказов');
  }
});

export const fetchOrderByNumberThunk = createAsyncThunk<
  TOrder,
  number,
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
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
    wsConnectSuccess: (state) => {
      state.wsConnected = true;
      state.loadingOrders = false;
      state.error = null;
    },
    wsConnectError: (state, action) => {
      state.wsConnected = false;
      state.error = action.payload;
      state.loadingOrders = false;
    },
    wsDisconnect: (state) => {
      state.wsConnected = false;
    },
    wsMessage: (state, action: PayloadAction<{ orders: TOrder[] }>) => {
      const { orders } = action.payload;
      state.ordersData = orders.map((order) => ({
        ...order,
        status: state.statusUpdates[order._id] || order.status
      }));
    },
    openOrderModal: (state) => {
      state.isOrderModalOpen = true;
    },
    closeOrderModal: (state) => {
      state.isOrderModalOpen = false;
      state.order = null;
    },
    updateOrderStatus: (
      state,
      action: PayloadAction<{ orderId: string; status: string }>
    ) => {
      const { orderId, status } = action.payload;
      state.statusUpdates[orderId] = status;
      if (state.order && state.order._id === orderId) {
        state.order.status = status;
      }
      if (state.ordersData) {
        const orderIndex = state.ordersData.findIndex(
          (order) => order._id === orderId
        );
        if (orderIndex !== -1) {
          state.ordersData[orderIndex].status = status;
        }
      }
    },
    clearOrderStatus: (state, action: PayloadAction<string>) => {
      delete state.statusUpdates[action.payload];
    },
    addNewOrder: (state, action: PayloadAction<string>) => {
      const orderId = action.payload;
      if (!state.newOrderIds.includes(orderId)) {
        state.newOrderIds = [orderId, ...state.newOrderIds];
      }
    },
    removeNewOrder: (state, action: PayloadAction<string>) => {
      const orderId = action.payload;
      state.newOrderIds = state.newOrderIds.filter((id) => id !== orderId);
    },
    incrementReconnectAttempts: (state) => {
      state.reconnectAttempts += 1;
    },
    resetReconnectAttempts: (state) => {
      state.reconnectAttempts = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(connectOrdersWs.pending, (state) => {
        state.loadingOrders = true;
        state.error = null;
      })
      .addCase(connectOrdersWs.fulfilled, (state) => {
        state.loadingOrders = false;
      })
      .addCase(connectOrdersWs.rejected, (state, action) => {
        state.loadingOrders = false;
        state.error =
          (action.payload as string) ?? 'Ошибка подключения WebSocket';
      })
      .addCase(createOrderThunk.pending, (state) => {
        state.loadingOrder = true;
        state.error = null;
      })
      .addCase(createOrderThunk.fulfilled, (state, action) => {
        state.loadingOrder = false;
        state.order = { ...action.payload, status: 'created' };
        state.statusUpdates[action.payload._id] = 'created';
        state.isOrderModalOpen = true;
      })
      .addCase(createOrderThunk.rejected, (state, action) => {
        state.loadingOrder = false;
        state.error = action.payload || 'Ошибка загрузки заказов';
      })
      .addCase(fetchOrdersThunk.pending, (state) => {
        state.loadingOrders = true;
        state.error = null;
      })
      .addCase(fetchOrdersThunk.fulfilled, (state, action) => {
        state.loadingOrders = false;
        state.ordersData = action.payload.map((order) => ({
          ...order,
          status: state.statusUpdates[order._id] || order.status
        }));
      })
      .addCase(fetchOrdersThunk.rejected, (state, action) => {
        state.loadingOrders = false;
        state.error = action.payload || 'Ошибка загрузки заказов';
      })
      .addCase(fetchOrderByNumberThunk.pending, (state) => {
        state.loadingOrder = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumberThunk.fulfilled, (state, action) => {
        state.loadingOrder = false;
        state.order = {
          ...action.payload,
          status:
            state.statusUpdates[action.payload._id] || action.payload.status
        };
      })
      .addCase(fetchOrderByNumberThunk.rejected, (state, action) => {
        state.loadingOrder = false;
        state.error = action.payload || 'Ошибка поиска заказа';
      });
  }
});

export const startOrderStatusUpdate =
  (orderId: string) => (dispatch: AppDispatch) => {
    const pendingTimeout = setTimeout(() => {
      dispatch(updateOrderStatus({ orderId, status: 'pending' }));
    }, 20000);
    const doneTimeout = setTimeout(() => {
      dispatch(updateOrderStatus({ orderId, status: 'done' }));
      dispatch(clearOrderStatus(orderId));
    }, 60000);
    return () => {
      clearTimeout(pendingTimeout);
      clearTimeout(doneTimeout);
    };
  };

export const addNewOrderWithTimeout =
  (orderId: string) => (dispatch: AppDispatch) => {
    dispatch(addNewOrder(orderId));
    const timeout = setTimeout(() => {
      dispatch(removeNewOrder(orderId));
    }, 5000);
    return () => clearTimeout(timeout);
  };

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
    ? {
        ...order,
        status: state.order.statusUpdates[order._id] || order.status
      }
    : null;
};
export const selectNewOrderIds = (state: RootState) => state.order.newOrderIds;
export const selectWsConnected = (state: RootState) => state.order.wsConnected;

export const {
  openOrderModal,
  closeOrderModal,
  updateOrderStatus,
  clearOrderStatus,
  addNewOrder,
  removeNewOrder
} = orderSlice.actions;
export default orderSlice.reducer;
