import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import {
  selectOrders,
  selectLoadingOrders,
  selectOrderError,
  fetchOrdersThunk
} from '../../services/reducers/orderSlice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders) || []; // Получаем заказы из стейта
  const isLoading = useSelector(selectLoadingOrders);
  const error = useSelector(selectOrderError);

  // Запрашиваем заказы при монтировании компонента
  useEffect(() => {
    dispatch(fetchOrdersThunk());
  }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <div className='text text_type_main-medium text_color_error'>
        Ошибка загрузки заказов: {error}
      </div>
    );
  }

  return <ProfileOrdersUI orders={orders} />;
};
