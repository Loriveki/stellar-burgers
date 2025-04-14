import { FC } from 'react';

import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { useSelector } from '../../services/store';
import { selectFeed } from '../../services/reducers/feedSlice';

// Функция получает список заказов и статус,
// фильтрует заказы по этому статусу,
// извлекает их номера и возвращает не более 20 номеров
const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status) // Фильтрация заказов по статусу
    .map((item) => item.number) // Получение номера заказа
    .slice(0, 20); // Ограничение до 20 элементов

export const FeedInfo: FC = () => {
  const feed = useSelector(selectFeed);
  const orders = feed?.orders || [];

  const readyOrders = getOrders(orders, 'done');

  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders} // Передаем готовые заказы
      pendingOrders={pendingOrders} // Передаем заказы в ожидании
      feed={feed} // Передаем информацию о фиде
    />
  );
};
