import { FC, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './constructor-page.module.css';
import { BurgerIngredients, BurgerConstructor } from '../../components';
import { Preloader } from '../../components/ui';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent
} from '@dnd-kit/core';
import { useDispatch, useSelector } from '../../services/store';
import {
  addIngredient,
  moveIngredient,
  selectConstructor
} from '../../services/reducers/constructorSlice';
import { selectLoadingIngredients } from '../../services/reducers/ingredientsSlice';
import { TConstructorIngredient, TIngredient } from '../../utils/types';
import { BurgerIngredientUI } from '@ui';
import clsx from 'clsx';

export const ConstructorPage: FC = () => {
  const dispatch = useDispatch();
  const constructorItems = useSelector(selectConstructor);
  const isIngredientsLoading = useSelector(selectLoadingIngredients);
  const [isOverConstructor, setIsOverConstructor] = useState(false);
  const [draggedIngredient, setDraggedIngredient] =
    useState<TIngredient | null>(null);
  const location = useLocation();
  const CONSTRUCTOR_AREA_ID = 'constructor-area';

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 }
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const ingredient = event.active.data.current?.ingredient;
    if (ingredient && 'type' in ingredient) {
      setDraggedIngredient(ingredient as TIngredient);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setDraggedIngredient(null);

    if (!over) {
      setIsOverConstructor(false);
      return;
    }

    const draggedId = active.id as string;
    const overId = over.id as string;

    if (overId === CONSTRUCTOR_AREA_ID) {
      const ingredientData = active.data.current?.ingredient;
      if (ingredientData) {
        const newIngredient: TConstructorIngredient = {
          ...ingredientData,
          uniqueId: `${ingredientData._id}-${Date.now()}`
        };
        dispatch(addIngredient(newIngredient));
      }
      setIsOverConstructor(false);
      return;
    }

    const draggedIngredient = constructorItems.ingredients.find(
      (item: TConstructorIngredient) => item.uniqueId === draggedId
    );
    const targetIngredient = constructorItems.ingredients.find(
      (item: TConstructorIngredient) => item.uniqueId === overId
    );

    if (draggedIngredient && targetIngredient) {
      const fromIndex = constructorItems.ingredients.indexOf(draggedIngredient);
      const toIndex = constructorItems.ingredients.indexOf(targetIngredient);

      if (fromIndex !== toIndex && fromIndex !== -1 && toIndex !== -1) {
        dispatch(moveIngredient({ fromIndex, toIndex }));
      }
    }
    setIsOverConstructor(false);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    setIsOverConstructor(over?.id === CONSTRUCTOR_AREA_ID);
  };

  return (
    <>
      {isIngredientsLoading ? (
        <Preloader />
      ) : (
        <main className={styles.containerMain}>
          <h1
            className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
          >
            Соберите бургер
          </h1>
          <div className={clsx(styles.main, 'pl-5', 'pr-5')}>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
            >
              <BurgerIngredients />
              <BurgerConstructor isDraggingOver={isOverConstructor} />
              <DragOverlay>
                {draggedIngredient ? (
                  <div className={styles.dragOverlay}>
                    <BurgerIngredientUI
                      ingredient={draggedIngredient}
                      count={0}
                      locationState={{ background: location }}
                      handleAdd={() => {}}
                      isDragging
                    />
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          </div>
        </main>
      )}
    </>
  );
};
