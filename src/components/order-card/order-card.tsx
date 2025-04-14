import { FC, memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { OrderCardProps } from './type';
import { TIngredient } from '@utils-types';
import { OrderCardUI } from '../ui/order-card';

import { useSelector } from '../../services/store'; // путь уточни, если другой
import { selectIngredients } from '../../services/reducers/ingredientsSlice';

const maxIngredients = 6; // Максимальное количество ингредиентов, которое будем показывать на карточке

export const OrderCard: FC<OrderCardProps> = memo(({ order }) => {
  const location = useLocation(); // Получаем информацию о текущем маршруте

  /** TODO: взять переменную из стора */
  const ingredients = useSelector(selectIngredients); // Массив всех ингредиентов (пока заглушка)

  // Мемоизируем обработку данных заказа, чтобы избежать лишних вычислений при каждом рендере
  const orderInfo = useMemo(() => {
    // Если нет ингредиентов, возвращаем null
    if (!ingredients.length) return null;

    // Формируем список ингредиентов для текущего заказа
    const ingredientsInfo = order.ingredients.reduce(
      (acc: TIngredient[], item: string) => {
        // Ищем каждый ингредиент в массиве всех ингредиентов
        const ingredient = ingredients.find((ing) => ing._id === item);
        if (ingredient) return [...acc, ingredient]; // Если нашли, добавляем в новый массив
        return acc;
      },
      [] // Начальное значение
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
  }, [order, ingredients]); // Хук будет пересчитывать данные только при изменении order или ingredients

  // Если данные о заказе отсутствуют, ничего не рендерим
  if (!orderInfo) return null;

  return (
    <OrderCardUI
      orderInfo={orderInfo}
      maxIngredients={maxIngredients}
      locationState={{ background: location }}
    />
  );
});
