import { FC, memo } from 'react';

import { OrdersListProps } from './type';
import { OrdersListUI } from '@ui';

// Основной компонент для отображения списка заказов
export const OrdersList: FC<OrdersListProps> = memo(({ orders }) => {
  // Сортировка заказов по дате (от самых новых к самым старым)
  const orderByDate = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return <OrdersListUI orderByDate={orderByDate} />;
});
