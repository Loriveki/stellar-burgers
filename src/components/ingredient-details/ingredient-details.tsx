import { FC, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import styles from '../ui/ingredient-details/ingredient-details.module.css';
import {
  selectSelectedIngredient,
  selectIngredientsLoaded,
  selectIngredientById,
  setSelectedIngredient,
  clearSelectedIngredient
} from '../../services/reducers/ingredientsSlice';

type IngredientDetailsProps = {
  isModal?: boolean;
};

export const IngredientDetails: FC<IngredientDetailsProps> = ({
  isModal = false
}) => {
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();

  const loaded = useSelector(selectIngredientsLoaded);
  const selectedIngredient = useSelector(selectSelectedIngredient);
  const ingredientFromList = useSelector(selectIngredientById(id || ''));

  useEffect(() => {
    if (!selectedIngredient && loaded && ingredientFromList) {
      dispatch(setSelectedIngredient(ingredientFromList));
    }
  }, [selectedIngredient, loaded, ingredientFromList, dispatch]);

  useEffect(
    () => () => {
      dispatch(clearSelectedIngredient());
    },
    [dispatch]
  );

  if (!selectedIngredient) {
    return <Preloader />;
  }

  const content = (
    <IngredientDetailsUI
      ingredientData={selectedIngredient}
      withTitle={!isModal}
    />
  );

  return isModal ? (
    content
  ) : (
    <div className={styles.pageWrapper}>{content}</div>
  );
};
