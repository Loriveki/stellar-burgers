import { FC, memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { OrderCardProps } from './type';
import { TIngredient } from '@utils-types';
import { OrderCardUI } from '../ui/order-card';
import { useSelector } from '../../services/store';
import { selectIngredients } from '../../services/reducers/ingredientsSlice';

const maxIngredients = 6;

interface ExtendedOrderCardProps extends OrderCardProps {
  isNew?: boolean;
}

export const OrderCard: FC<ExtendedOrderCardProps> = memo(
  ({ order, isNew = false }) => {
    const location = useLocation();
    const ingredients = useSelector(selectIngredients);

    // Мемоизируем обработку данных заказа, чтобы избежать лишних вычислений при каждом рендере
    const orderInfo = useMemo(() => {
      if (!ingredients.length) return null;

      // Формируем список ингредиентов для текущего заказа
      const ingredientsInfo = order.ingredients.reduce(
        (acc: TIngredient[], item: string) => {
          const ingredient = ingredients.find((ing) => ing._id === item);
          return ingredient ? [...acc, ingredient] : acc;
        },
        []
      );

      // Считаем общую стоимость всех ингредиентов
      const total = ingredientsInfo.reduce((acc, item) => acc + item.price, 0);

      // Ограничиваем количество ингредиентов для отображения
      const ingredientsToShow = ingredientsInfo.slice(0, maxIngredients);

      // Если ингредиентов больше, чем показываем, показываем количество оставшихся
      const remains =
        ingredientsInfo.length > maxIngredients
          ? ingredientsInfo.length - maxIngredients
          : 0;

      // Форматируем дату создания заказа
      const date = new Date(order.createdAt);

      // Возвращаем объект с обработанными данными для отображения
      return {
        ...order,
        ingredientsInfo,
        ingredientsToShow,
        remains,
        total,
        date
      };
    }, [order, ingredients]);

    if (!orderInfo) return null;

    return (
      <OrderCardUI
        orderInfo={orderInfo}
        maxIngredients={maxIngredients}
        locationState={{ background: location }}
        isNew={isNew}
      />
    );
  }
);
