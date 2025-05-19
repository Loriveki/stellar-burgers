import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import {
  selectOrders,
  selectLoadingOrders,
  fetchOrdersThunk,
  connectOrdersWs,
  disconnectOrdersWs
} from '../../services/reducers/orderSlice';
import { selectAccessToken } from '../../services/reducers/authSlice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders) || [];
  const isLoading = useSelector(selectLoadingOrders);
  const accessToken = useSelector(selectAccessToken);

  const ORDERS_WS_URL = accessToken
    ? `wss://norma.nomoreparties.space/orders?token=${accessToken.replace('Bearer ', '')}`
    : null;

  // Запрашиваем заказы при монтировании компонента
  useEffect(() => {
    dispatch(fetchOrdersThunk());
  }, [dispatch]);

  // Подключение WebSocket для заказов пользователя
  useEffect(() => {
    if (accessToken && ORDERS_WS_URL) {
      dispatch(connectOrdersWs(ORDERS_WS_URL));
    }
    return () => {
      dispatch(disconnectOrdersWs());
    };
  }, [dispatch, accessToken]);

  if (isLoading) {
    return <Preloader />;
  }
  return <ProfileOrdersUI orders={orders} />;
};
