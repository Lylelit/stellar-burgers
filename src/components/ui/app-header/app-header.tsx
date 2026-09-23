import {
  BurgerIcon,
  ListIcon,
  ProfileIcon,
  Logo,
} from '@krgaa/react-developer-burger-ui-components';
import { NavLink, useMatch } from 'react-router-dom';

import type { TAppHeaderUIProps } from './type';

import styles from './app-header.module.css';

export const AppHeaderUI = ({ userName }: TAppHeaderUIProps): React.JSX.Element => {
  const isIngredientPage = Boolean(useMatch('/ingredients/:id'));

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `${styles.link} ${isActive || isIngredientPage ? styles.link_active : ''}`
            }
          >
            {({ isActive }) => (
              <>
                <BurgerIcon type={isActive || isIngredientPage ? 'primary' : 'secondary'} />
                <p className="text text_type_main-default ml-2 mr-10">Конструктор</p>
              </>
            )}
          </NavLink>
          <NavLink
            to="/feed"
            className={({ isActive }) => `${styles.link} ${isActive ? styles.link_active : ''}`}
          >
            {({ isActive }) => (
              <>
                <ListIcon type={isActive ? 'primary' : 'secondary'} />
                <p className="text text_type_main-default ml-2">Лента заказов</p>
              </>
            )}
          </NavLink>
        </div>
        <NavLink to="/" className={styles.logo} aria-label="На главную">
          <Logo className="" />
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `${styles.link} ${styles.link_position_last} ${isActive ? styles.link_active : ''}`
          }
        >
          {({ isActive }) => (
            <>
              <ProfileIcon type={isActive ? 'primary' : 'secondary'} />
              <p className="text text_type_main-default ml-2">
                {userName || 'Личный кабинет'}
              </p>
            </>
          )}
        </NavLink>
      </nav>
    </header>
  );
};
