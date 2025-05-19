import { TIngredient } from '../../utils/types';

export type TIngredientsWithCount = {
  [key: string]: TIngredient & { count: number };
};
