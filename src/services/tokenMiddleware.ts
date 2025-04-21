import { Middleware } from '@reduxjs/toolkit';
import { refreshTokenThunk } from '../services/reducers/authSlice';
import { connectOrdersWs } from '../services/reducers/orderSlice';
import { RootState, AppDispatch } from '../services/types';

export const tokenMiddleware: Middleware<{}, RootState, AppDispatch> =
  (store) => (next) => (action) => {
    if (connectOrdersWs.pending.match(action)) {
      const state = store.getState();
      const accessToken = state.auth.accessToken;

      const tokenPayload = JSON.parse(atob(accessToken!.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);

      if (tokenPayload.exp < currentTime) {
        return store.dispatch(refreshTokenThunk()).then(() => {
          const newState = store.getState();
          const newAccessToken = newState.auth.accessToken;
          const newUrl = `wss://norma.nomoreparties.space/orders?token=${newAccessToken!.replace('Bearer ', '')}`;
          return store.dispatch(connectOrdersWs(newUrl));
        });
      }
    }

    return next(action);
  };
