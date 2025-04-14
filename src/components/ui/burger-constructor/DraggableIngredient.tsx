import React, { FC } from 'react';
import styles from './burger-constructor.module.css';
import { BurgerConstructorUIProps } from './type';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorElement, Modal } from '@components';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface DraggableIngredientProps {
  item: TConstructorIngredient;
  index: number;
  totalItems: number;
}

export const DraggableIngredient: FC<DraggableIngredientProps> = ({
  item,
  index,
  totalItems
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: item.uniqueId
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition:
      transition ||
      'transform 0.2s ease, opacity 0.2s ease, box-shadow 0.2s ease'
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={styles['sortable-ingredient']}
    >
      <BurgerConstructorElement
        ingredient={item}
        index={index}
        totalItems={totalItems}
      />
    </div>
  );
};
