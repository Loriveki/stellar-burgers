import React, { FC } from 'react';
import {
  Button,
  ConstructorElement,
  CurrencyIcon
} from '@zlden/react-developer-burger-ui-components';
import styles from './burger-constructor.module.css';
import { BurgerConstructorUIProps } from './type';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorElement, Modal } from '@components';
import { Preloader, OrderDetailsUI } from '@ui';
import { useDispatch } from '../../../services/store';
import {
  moveIngredient,
  addIngredient
} from '../../../services/reducers/constructorSlice';
import { DraggableIngredient } from '../../ui/burger-constructor/DraggableIngredient';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';

export const BurgerConstructorUI: FC<BurgerConstructorUIProps> = ({
  constructorItems,
  orderRequest,
  price,
  orderModalData,
  onOrderClick,
  closeOrderModal,
  isOver = false
}) => {
  const { setNodeRef: setDroppableRef } = useDroppable({
    id: 'constructor-area'
  });

  const droppableStyle = {
    transition: 'background-color 0.2s ease',
    backgroundColor: isOver ? 'rgba(107, 51, 121, 0.22)' : 'transparent',
    border: isOver ? '2px dashed rgb(105, 41, 134)' : 'none',
    maxHeight: '656px',
    overflowY: 'scroll' as const,
    padding: '8px 0'
  };

  const sortableItems = constructorItems.ingredients.map(
    (item: TConstructorIngredient) => item.uniqueId
  );

  return (
    <section className={styles.burger_constructor}>
      {constructorItems.bun ? (
        <div className={`${styles.element} mb-4 mr-4`}>
          <ConstructorElement
            type='top'
            isLocked
            text={`${constructorItems.bun.name} (верх)`}
            price={constructorItems.bun.price}
            thumbnail={constructorItems.bun.image}
          />
        </div>
      ) : (
        <div
          className={`${styles.noBuns} ${styles.noBunsTop} ml-8 mb-4 mr-5 text text_type_main-default`}
        >
          Выберите булки
        </div>
      )}

      <div ref={setDroppableRef} style={droppableStyle}>
        <SortableContext
          items={sortableItems}
          strategy={verticalListSortingStrategy}
        >
          <ul className={styles.elements}>
            {constructorItems.ingredients.length > 0 ? (
              constructorItems.ingredients.map(
                (item: TConstructorIngredient, index: number) => (
                  <DraggableIngredient
                    key={item.uniqueId}
                    item={item}
                    index={index}
                    totalItems={constructorItems.ingredients.length}
                  />
                )
              )
            ) : (
              <div
                className={`${styles.noBuns} ml-8 mb-4 mr-5 text text_type_main-default`}
              >
                Выберите начинку
              </div>
            )}
          </ul>
        </SortableContext>
      </div>
      {constructorItems.bun ? (
        <div className={`${styles.element} mt-4 mr-4`}>
          <ConstructorElement
            type='bottom'
            isLocked
            text={`${constructorItems.bun.name} (низ)`}
            price={constructorItems.bun.price}
            thumbnail={constructorItems.bun.image}
          />
        </div>
      ) : (
        <div
          className={`${styles.noBuns} ${styles.noBunsBottom} ml-8 mb-4 mr-5 text text_type_main-default`}
        >
          Выберите булки
        </div>
      )}

      <div className={`${styles.total} mt-10 mr-4`}>
        <div className={`${styles.cost} mr-10`}>
          <p className={`text ${styles.text} mr-2`}>{price}</p>
          <CurrencyIcon type='primary' />
        </div>
        <Button
          htmlType='button'
          type='primary'
          size='large'
          children='Оформить заказ'
          onClick={onOrderClick}
        />
      </div>

      {orderRequest && (
        <Modal onClose={closeOrderModal} title={'Оформляем заказ...'}>
          <Preloader />
        </Modal>
      )}

      {orderModalData && (
        <Modal
          onClose={closeOrderModal}
          title={orderRequest ? 'Оформляем заказ...' : ''}
        >
          <OrderDetailsUI orderNumber={orderModalData.number} />
        </Modal>
      )}
    </section>
  );
};
