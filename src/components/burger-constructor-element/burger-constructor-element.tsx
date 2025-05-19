import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useDispatch } from '../../services/store';
import {
  moveIngredient,
  removeIngredient
} from '../../services/reducers/constructorSlice';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    const handleMoveDown = () => {
      dispatch(moveIngredient({ fromIndex: index, toIndex: index + 1 }));
    };

    const handleMoveUp = () => {
      dispatch(moveIngredient({ fromIndex: index, toIndex: index - 1 }));
    };

    const handleClose = () => {
      dispatch(removeIngredient(index));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient} // Передаем ингредиент
        index={index} // Индекс элемента в списке
        totalItems={totalItems} // Общее количество элементов в конструкторе
        handleMoveUp={handleMoveUp} // Функция перемещения вверх
        handleMoveDown={handleMoveDown} // Функция перемещения вниз
        handleClose={handleClose} // Функция удаления ингредиента
      />
    );
  }
);
