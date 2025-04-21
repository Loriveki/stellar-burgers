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
  let textColor = ''; // Стиль для текста (цвет)
  const pendingColor = '#E52B1A';
  const doneColor = '#00CCCC';
  const defaultColor = '#F2F2F3';

  // В зависимости от статуса, задаем стиль для текста
  switch (status) {
    case 'pending':
      textColor = pendingColor;
      break;
    case 'done':
      textColor = doneColor;
      break;
    default:
      textColor = defaultColor;
  }

  return (
    <OrderStatusUI textStyle={textColor} text={statusText[status] || status} />
  );
};
