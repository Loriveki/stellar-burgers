import { TIngredient } from '@utils-types';

export interface TIngredientsCategoryUIProps {
  title: string;
  titleRef: React.RefObject<HTMLHeadingElement>;
  ingredients: TIngredient[];
  ingredientsCounters: { [key: string]: number };
  ref: React.Ref<HTMLUListElement>;
}
