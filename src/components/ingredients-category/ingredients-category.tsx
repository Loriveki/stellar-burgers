import { forwardRef, useMemo } from 'react';
import { TIngredientsCategoryProps } from './type';
import { TIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '../ui/ingredients-category';

import { useSelector } from '../../services/store';
import {
  selectBun,
  selectIngredients
} from '../../services/reducers/constructorSlice';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(
  (
    { title, titleRef, ingredients, renderIngredient, ingredientsCounters },
    ref
  ) => {
    const bun = useSelector(selectBun);
    const constructorIngredients = useSelector(selectIngredients);

    const burgerConstructor = {
      bun,
      ingredients: constructorIngredients
    };

    const updatedIngredientsCounters = useMemo(() => {
      const { bun, ingredients } = burgerConstructor;
      const counters: { [key: string]: number } = {};
      // Подсчитываем количество каждого ингредиента
      if (ingredients && Array.isArray(ingredients)) {
        ingredients.forEach((ingredient: TIngredient) => {
          if (!counters[ingredient._id]) counters[ingredient._id] = 0;
          counters[ingredient._id]++;
        });
      }
      if (bun) counters[bun._id] = 2;
      return counters;
    }, [burgerConstructor]);

    return (
      <IngredientsCategoryUI
        title={title}
        titleRef={titleRef}
        ingredients={ingredients}
        ingredientsCounters={updatedIngredientsCounters}
        ref={ref}
      >
        {/* Рендерим ингредиенты через renderIngredient */}
        {ingredients.map(renderIngredient)}
      </IngredientsCategoryUI>
    );
  }
);
