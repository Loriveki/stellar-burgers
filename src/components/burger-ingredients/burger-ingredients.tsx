import { useState, useRef, useEffect, FC, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';

import { TTabMode } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';

import { useSelector } from '../../services/store';
import { selectIngredients } from '../../services/reducers/ingredientsSlice';

export const BurgerIngredients: FC = () => {
  const allIngredients = useSelector(selectIngredients);

  const buns = useMemo(
    () => allIngredients.filter((item) => item.type === 'bun'),
    [allIngredients]
  );
  const mains = useMemo(
    () => allIngredients.filter((item) => item.type === 'main'),
    [allIngredients]
  );
  const sauces = useMemo(
    () => allIngredients.filter((item) => item.type === 'sauce'),
    [allIngredients]
  );

  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');
  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  // Используем useInView для определения, какая секция сейчас в зоне видимости
  const [bunsRef, inViewBuns] = useInView({
    threshold: 0
  });

  const [mainsRef, inViewFilling] = useInView({
    threshold: 0
  });

  const [saucesRef, inViewSauces] = useInView({
    threshold: 0
  });

  // Следим за изменением видимости секций и обновляем активную вкладку

  useEffect(() => {
    if (inViewBuns) {
      setCurrentTab('bun');
    } else if (inViewSauces) {
      setCurrentTab('sauce');
    } else if (inViewFilling) {
      setCurrentTab('main');
    }
  }, [inViewBuns, inViewFilling, inViewSauces]);

  // Обработчик клика на вкладку (прокрутка)
  const onTabClick = (tab: string) => {
    setCurrentTab(tab as TTabMode);
    if (tab === 'bun')
      titleBunRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'main')
      titleMainRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'sauce')
      titleSaucesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <BurgerIngredientsUI
      currentTab={currentTab} // Текущая активная вкладка
      buns={buns} // Список булочек
      mains={mains} // Список основных ингредиентов
      sauces={sauces} // Список соусов
      titleBunRef={titleBunRef} // Реф для заголовка булочек
      titleMainRef={titleMainRef} // Реф для заголовка основных ингредиентов
      titleSaucesRef={titleSaucesRef} // Реф для заголовка соусов
      bunsRef={bunsRef} // Реф для отслеживания видимости булочек
      mainsRef={mainsRef} // Реф для отслеживания видимости основных ингредиентов
      saucesRef={saucesRef} // Реф для отслеживания видимости соусов
      onTabClick={onTabClick} // Функция смены вкладки
    />
  );
};
