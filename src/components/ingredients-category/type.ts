import { TIngredient } from '@utils-types';

export interface TIngredientsCategoryProps {
  title: string;
  titleRef: React.RefObject<HTMLHeadingElement>;
  ingredients: TIngredient[];
}
