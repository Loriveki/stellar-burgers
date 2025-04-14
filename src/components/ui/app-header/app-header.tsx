import React, { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import { NavLink } from 'react-router-dom';

// Компонент AppHeader, который отображает навигационное меню в хедере
export const AppHeaderUI: FC<TAppHeaderUIProps> = ({
  userName,
  currentPath
}) => {
  // Функция для проверки активности маршрута, включая вложенные пути
  const isActiveRoute = (path: string, isActive: boolean) =>
    isActive || currentPath.startsWith(`${path}/`);

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          {/* Элемент "Конструктор" */}
          <NavLink to='/' className={styles.link} end>
            {({ isActive }) => (
              <>
                <BurgerIcon type={isActive ? 'primary' : 'secondary'} />
                <p
                  className={`text text_type_main-default ml-2 mr-10 ${
                    isActive ? '' : 'text_color_inactive'
                  }`}
                >
                  Конструктор
                </p>
              </>
            )}
          </NavLink>

          {/* Элемент "Лента заказов" */}
          <NavLink to='/feed' className={styles.link}>
            {({ isActive }) => (
              <>
                <ListIcon
                  type={
                    isActiveRoute('/feed', isActive) ? 'primary' : 'secondary'
                  }
                />
                <p
                  className={`text text_type_main-default ml-2 ${
                    isActiveRoute('/feed', isActive)
                      ? ''
                      : 'text_color_inactive'
                  }`}
                >
                  Лента заказов
                </p>
              </>
            )}
          </NavLink>
        </div>

        {/* Логотип */}
        <div className={styles.logo}>
          <NavLink to='/'>
            <Logo className='' />
          </NavLink>
        </div>

        {/* Профиль */}
        <NavLink
          to='/profile'
          className={`${styles.link} ${styles.link_position_last}`}
        >
          {({ isActive }) => (
            <>
              <ProfileIcon
                type={
                  isActiveRoute('/profile', isActive) ? 'primary' : 'secondary'
                }
              />
              <p
                className={`text text_type_main-default ml-2 ${
                  isActiveRoute('/profile', isActive)
                    ? ''
                    : 'text_color_inactive'
                }`}
              >
                {userName || 'Личный кабинет'}
              </p>
            </>
          )}
        </NavLink>
      </nav>
    </header>
  );
};
