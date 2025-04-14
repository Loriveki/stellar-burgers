import { FC, useMemo, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';

import { useSelector, useDispatch } from '../../services/store';
import { useParams } from 'react-router-dom';
import { selectIngredients } from '../../services/reducers/ingredientsSlice'; // Путь к слайсу с ингредиентами
import {
  fetchOrderByNumberThunk,
  selectOrderById
} from '../../services/reducers/orderSlice';
import { RootState } from '../../services/store';

type OrderInfoProps = {
  isModal?: boolean;
};
import styles from '../../components/ui/order-info/order-info.module.css';

export const OrderInfo: FC<OrderInfoProps> = ({ isModal = false }) => {
  const dispatch = useDispatch();
  const { number } = useParams<{ number: string }>();

  const ingredients = useSelector(selectIngredients);
  const orderData = useSelector((state: RootState) =>
    selectOrderById(state, number ?? '')
  );

  useEffect(() => {
    if (number) {
      const orderNumber = Number(number);
      dispatch(fetchOrderByNumberThunk(orderNumber));
    }
  }, [number, dispatch]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    // Если нет данных о заказе или ингредиентах, возвращаем null
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt); // Преобразуем дату создания заказа

    // Тип для ингредиентов с количеством
    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    // Формируем объект с ингредиентами и их количеством
    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        // Если ингредиент еще не был добавлен
        if (!acc[item]) {
          // Находим ингредиент по ID
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          // Если ингредиент уже добавлен, увеличиваем его количество
          acc[item].count++;
        }

        return acc;
      },
      {} // Начальное значение
    );

    // Считаем общую стоимость заказа
    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    // Возвращаем все обработанные данные
    return {
      ...orderData, // Исходные данные заказа
      ingredientsInfo, // Информация о ингредиентах с их количеством
      date, // Отформатированная дата
      total // Общая стоимость
    };
  }, [orderData, ingredients]);

  // условие только здесь, после useMemo
  if (!number || !orderInfo) {
    return <Preloader />;
  }

  return isModal ? (
    <OrderInfoUI orderInfo={orderInfo} isModal />
  ) : (
    <div className={styles.pageWrapper}>
      <OrderInfoUI orderInfo={orderInfo} isModal={false} />
    </div>
  );
};
