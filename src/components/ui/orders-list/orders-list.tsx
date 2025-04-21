import { FC } from 'react';
import styles from './orders-list.module.css';
import { OrdersListUIProps } from './type';
import { OrderCard } from '@components';

interface ExtendedOrdersListUIProps extends OrdersListUIProps {
  newOrderIds?: string[];
}

export const OrdersListUI: FC<ExtendedOrdersListUIProps> = ({
  orderByDate,
  newOrderIds
}) => (
  <div className={`${styles.content}`}>
    {orderByDate.map((order) => (
      <OrderCard
        order={order}
        key={order._id}
        isNew={newOrderIds ? newOrderIds.includes(order._id) : false}
      />
    ))}
  </div>
);
