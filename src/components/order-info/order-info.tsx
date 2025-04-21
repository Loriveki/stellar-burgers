import { FC, useMemo, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useSelector, useDispatch } from '../../services/store';
import { useParams } from 'react-router-dom';
import {
  selectIngredients,
  selectLoadingIngredients
} from '../../services/reducers/ingredientsSlice';
import {
  fetchOrderByNumberThunk,
  selectOrderById
} from '../../services/reducers/orderSlice';
import { RootState } from '../../services/types';
import styles from '../../components/ui/order-info/order-info.module.css';
import { TIngredientsWithCount } from './type';

type OrderInfoProps = {
  isModal?: boolean;
};

export const OrderInfo: FC<OrderInfoProps> = ({ isModal = false }) => {
  const dispatch = useDispatch();
  const { number } = useParams<{ number: string }>();

  const ingredients = useSelector(selectIngredients);
  const orderFromStore = useSelector((state: RootState) =>
    selectOrderById(state, number ?? '')
  );

  const isLoading = useSelector(selectLoadingIngredients);

  if (isLoading) {
    return <Preloader />;
  }

  useEffect(() => {
    if (number) {
      const orderNumber = Number(number);
      dispatch(fetchOrderByNumberThunk(orderNumber));
    }
  }, [number, dispatch]);

  const orderInfo = useMemo(() => {
    // Если нет данных о заказе или ингредиентах, возвращаем null
    if (!orderFromStore || !ingredients.length) return null;

    const date = new Date(orderFromStore.createdAt);

    // Формируем объект с ингредиентами и их количеством
    const ingredientsInfo = orderFromStore.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    // Считаем общую стоимость заказа
    const total = Object.values(ingredientsInfo).reduce(
      (acc: number, item: TIngredient & { count: number }) =>
        acc + item.price * item.count,
      0
    );

    // Возвращаем все обработанные данные
    return {
      ...orderFromStore,
      ingredientsInfo,
      date,
      total
    };
  }, [orderFromStore, ingredients]);

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
