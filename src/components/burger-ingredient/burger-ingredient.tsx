import { FC, memo } from 'react';
import { useLocation, Location } from 'react-router-dom';
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

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const dispatch = useDispatch();

    const { attributes, listeners, setNodeRef, transform } = useDraggable({
      id: ingredient._id,
      data: { ingredient }
    });

    const style = {
      transform: CSS.Translate.toString(transform),
      transition: 'transform 0.2s ease',
      cursor: 'grab'
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
      <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
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
