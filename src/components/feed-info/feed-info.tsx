import { FC } from 'react';
import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { useSelector } from '../../services/store';
import {
  selectFeed,
  selectLoadingFeed,
  selectFeedError
} from '../../services/reducers/feedSlice';
import { RootState } from '../../services/types';

// Функция получает список заказов и статус,
// фильтрует заказы по этому статусу,
// извлекает их номера и возвращает не более 20 номеров
const getOrders = (
  orders: TOrder[],
  status: string,
  statusUpdates: { [orderId: string]: string }
): number[] =>
  orders
    .filter((item) => (statusUpdates[item._id] || item.status) === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const feed = useSelector(selectFeed);
  const isLoading = useSelector(selectLoadingFeed);
  const error = useSelector(selectFeedError);
  const statusUpdates = useSelector(
    (state: RootState) => state.order.statusUpdates
  ) as { [orderId: string]: string };
  const orders = feed?.orders || [];

  const readyOrders = getOrders(orders, 'done', statusUpdates);
  const pendingOrders = getOrders(orders, 'pending', statusUpdates);

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
      isLoading={isLoading}
      error={error}
    />
  );
};
