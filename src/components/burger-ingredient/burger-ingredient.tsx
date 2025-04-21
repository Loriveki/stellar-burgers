import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { TConstructorIngredient } from '../../utils/types';
import { useDispatch } from '../../services/store';
import {
  addIngredient,
  setBun
} from '../../services/reducers/constructorSlice';
import styles from '../ui/burger-ingredient/burger-ingredient.module.css';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const dispatch = useDispatch();

    const { attributes, listeners, setNodeRef, transform } = useDraggable({
      id: ingredient._id,
      data: { ingredient }
    });

    const style = {
      transform: CSS.Translate.toString(transform)
    };

    const handleAdd = () => {
      if (ingredient.type === 'bun') {
        dispatch(setBun(ingredient));
      } else {
        const ingredientWithUniqueId: TConstructorIngredient = {
          ...ingredient,
          uniqueId: `${ingredient._id}-${Date.now()}`
        };
        dispatch(addIngredient(ingredientWithUniqueId));
      }
    };

    return (
      <div
        ref={setNodeRef}
        className={styles.draggable}
        {...listeners}
        {...attributes}
      >
        <BurgerIngredientUI
          ingredient={ingredient}
          count={count}
          locationState={{ background: location }}
          handleAdd={handleAdd}
          isDragging={false}
        />
      </div>
    );
  }
);
