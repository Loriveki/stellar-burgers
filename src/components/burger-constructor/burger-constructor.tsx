import { FC, useMemo, useEffect } from 'react';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import {
  selectBun,
  selectIngredients,
  clearConstructor
} from '../../services/reducers/constructorSlice';

import {
  selectCurrentOrder,
  selectIsOrderModalOpen,
  selectLoadingOrders,
  createOrderThunk
} from '../../services/reducers/orderSlice';
import { closeOrderModal } from '../../services/reducers/orderSlice';
import { getCookie } from '../../utils/cookie';

export interface BurgerConstructorProps {
  isOver?: boolean;
}

export const BurgerConstructor: FC<BurgerConstructorProps> = ({
  isOver = false
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const bun = useSelector(selectBun);
  const ingredients = useSelector(selectIngredients);
  const orderRequest = useSelector(selectLoadingOrders);
  const orderModalData = useSelector(selectCurrentOrder);
  const isOrderModalOpen = useSelector(selectIsOrderModalOpen);

  const constructorItems = {
    bun,
    ingredients
  };

  // Очистка конструктора после успешного заказа
  useEffect(() => {
    if (orderModalData && isOrderModalOpen) {
      dispatch(clearConstructor());
    }
  }, [orderModalData, isOrderModalOpen, dispatch]);

  // Функция для обработки нажатия на кнопку заказа
  const onOrderClick = () => {
    const accessToken = getCookie('accessToken');
    console.log('Access Token:', accessToken);
    if (!accessToken) {
      console.log('No access token, navigating to /login');
      navigate('/login');
      return;
    }
    if (!constructorItems.bun || orderRequest) return;
    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id
    ];
    dispatch(createOrderThunk(ingredientIds));
  };

  // Функция для закрытия модального окна заказа
  const handleCloseOrderModal = () => {
    dispatch(closeOrderModal());
  };

  // Вычисление общей стоимости бургера
  const price = useMemo(
    () =>
      (bun ? bun.price * 2 : 0) +
      (constructorItems.ingredients || []).reduce(
        (sum, item) => sum + item.price,
        0
      ),
    [bun, ingredients]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={handleCloseOrderModal}
      isOver={isOver}
    />
  );
};
