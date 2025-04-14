import React, { FC, memo, useMemo } from 'react';
import { Tab } from '@zlden/react-developer-burger-ui-components';

import styles from './burger-ingredients.module.css';
import { BurgerIngredientsUIProps } from './type';
import { IngredientsCategory } from '@components';

import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

const DraggableIngredient: FC<{ ingredient: any }> = ({ ingredient }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: ingredient._id,
    data: { ingredient } // Передаем данные ингредиента
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    cursor: 'grab'
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <img src={ingredient.image} alt={ingredient.name} />
      <p>{ingredient.name}</p>
      <p>{ingredient.price}</p>
    </div>
  );
};

// Компонент для выбора ингредиентов и переключения между категориями
export const BurgerIngredientsUI: FC<BurgerIngredientsUIProps> = memo(
  ({
    currentTab, // Текущая активная вкладка
    buns, // Список булок
    mains, // Список начинок
    sauces, // Список соусов
    titleBunRef, // Реф для заголовка "Булки"
    titleMainRef, // Реф для заголовка "Начинки"
    titleSaucesRef, // Реф для заголовка "Соусы"
    bunsRef, // Реф на контейнер булок
    mainsRef, // Реф на контейнер начинок
    saucesRef, // Реф на контейнер соусов
    onTabClick // Функция переключения вкладок
  }) => {
    // Подсчет количества ингредиентов
    const ingredientsCounters = useMemo(() => {
      const counters: { [key: string]: number } = {};

      // Подсчитываем количество булок, начинок и соусов
      const allIngredients = [...buns, ...mains, ...sauces];
      allIngredients.forEach((ingredient) => {
        if (!counters[ingredient._id]) counters[ingredient._id] = 0;
        counters[ingredient._id]++;
      });

      return counters;
    }, [buns, mains, sauces]);

    return (
      <section className={styles.burger_ingredients}>
        <nav>
          <ul className={styles.menu}>
            {' '}
            {/* Вкладки для выбора категории ингредиентов */}
            <Tab value='bun' active={currentTab === 'bun'} onClick={onTabClick}>
              Булки
            </Tab>
            <Tab
              value='main'
              active={currentTab === 'main'}
              onClick={onTabClick}
            >
              Начинки
            </Tab>
            <Tab
              value='sauce'
              active={currentTab === 'sauce'}
              onClick={onTabClick}
            >
              Соусы
            </Tab>
          </ul>
        </nav>
        <div className={styles.content}>
          {' '}
          {/* Контейнер для списка ингредиентов */}
          <IngredientsCategory
            title='Булки'
            titleRef={titleBunRef}
            ingredients={buns}
            ref={bunsRef}
            ingredientsCounters={ingredientsCounters}
            renderIngredient={(ingredient) => (
              <DraggableIngredient
                ingredient={ingredient}
                key={ingredient._id}
              />
            )}
          />
          <IngredientsCategory
            title='Начинки'
            titleRef={titleMainRef}
            ingredients={mains}
            ref={mainsRef}
            ingredientsCounters={ingredientsCounters}
            renderIngredient={(ingredient) => (
              <DraggableIngredient
                ingredient={ingredient}
                key={ingredient._id}
              />
            )}
          />
          <IngredientsCategory
            title='Соусы'
            titleRef={titleSaucesRef}
            ingredients={sauces}
            ref={saucesRef}
            ingredientsCounters={ingredientsCounters}
            renderIngredient={(ingredient) => (
              <DraggableIngredient
                ingredient={ingredient}
                key={ingredient._id}
              />
            )}
          />
        </div>
      </section>
    );
  }
);
