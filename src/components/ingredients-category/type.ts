import { TIngredient } from '@utils-types';

export interface TIngredientsCategoryProps {
  title: string;
  titleRef: React.RefObject<HTMLHeadingElement>;
  ingredients: TIngredient[];
  renderIngredient: (ingredient: TIngredient, index: number) => JSX.Element; // Изменено
  ingredientsCounters: { [key: string]: number };
}
