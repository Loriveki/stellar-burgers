import { FC, memo, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useSelector } from '../../services/store';
import { selectCurrentOrder } from '../../services/reducers/orderSlice';

import { TModalProps } from './type';
import { ModalUI } from '@ui';

const modalRoot = document.getElementById('modals');

export const Modal: FC<TModalProps> = memo(({ title, onClose, children }) => {
  const order = useSelector(selectCurrentOrder);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      e.key === 'Escape' && onClose();
    };

    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  // Форматируем заголовок с помощью тернарного оператора
  const orderTitle =
    title === 'Детали заказа' && order?.number
      ? `#${order.number.toString().padStart(6, '0')}`
      : title;

  return ReactDOM.createPortal(
    <ModalUI title={orderTitle} onClose={onClose}>
      {children}
    </ModalUI>,
    modalRoot as HTMLDivElement
  );
});
