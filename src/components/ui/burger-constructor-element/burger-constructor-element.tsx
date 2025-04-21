import { FC, memo } from 'react';
import styles from './burger-constructor-element.module.css';
import { ConstructorElement } from '@zlden/react-developer-burger-ui-components';
import { BurgerConstructorElementUIProps } from './type';
import { MoveButton } from '@zlden/react-developer-burger-ui-components';

// Компонент для отображения одного ингредиента в конструкторе бургера
export const BurgerConstructorElementUI: FC<BurgerConstructorElementUIProps> =
  memo(
    ({
      ingredient, // Информация об ингредиенте (название, цена, изображение)
      index, // Индекс элемента в списке
      totalItems, // Общее количество элементов
      handleMoveUp, // Функция для перемещения вверх
      handleMoveDown, // Функция для перемещения вниз
      handleClose // Функция удаления ингредиента
    }) => (
      <li className={`${styles.element} mb-4 mr-2`}>
        <MoveButton
          handleMoveDown={handleMoveDown}
          handleMoveUp={handleMoveUp}
          isUpDisabled={index === 0}
          isDownDisabled={index === totalItems - 1}
        />
        <div className={`${styles.element_fullwidth} ml-2`}>
          <ConstructorElement
            text={ingredient.name}
            price={ingredient.price}
            thumbnail={ingredient.image}
            handleClose={handleClose}
          />
        </div>
      </li>
    )
  );
