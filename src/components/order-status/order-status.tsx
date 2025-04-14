import React, { FC } from 'react';
import { OrderStatusProps } from './type';
import { OrderStatusUI } from '@ui';

// Объект с текстовыми значениями статуса заказа
const statusText: { [key: string]: string } = {
  pending: 'Готовится',
  done: 'Выполнен',
  created: 'Создан'
};

// Основной компонент для отображения статуса заказа
export const OrderStatus: FC<OrderStatusProps> = ({ status }) => {
  let textStyle = ''; // Стиль для текста (цвет)
  // В зависимости от статуса, задаем стиль для текста
  switch (status) {
    case 'pending': // Если заказ в процессе
      textStyle = '#E52B1A';
      break;
    case 'done': // Если заказ выполнен
      textStyle = '#00CCCC';
      break;
    default:
      textStyle = '#F2F2F3';
  }

  return (
    <OrderStatusUI textStyle={textStyle} text={statusText[status] || status} />
  );
};
