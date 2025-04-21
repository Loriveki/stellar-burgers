import { FC, memo } from 'react';
import { OrdersListProps } from './type';
import { OrdersListUI } from '@ui';

interface ExtendedOrdersListProps extends OrdersListProps {
  newOrderIds?: string[]; // Обновляем тип на string[]
}

export const OrdersList: FC<ExtendedOrdersListProps> = memo(
  ({ orders, newOrderIds }) => {
    const orderByDate = [...orders].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return <OrdersListUI orderByDate={orderByDate} newOrderIds={newOrderIds} />;
  }
);
