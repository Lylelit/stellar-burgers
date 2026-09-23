import { BurgerIngredients, BurgerConstructor } from '@components';
import {
  fetchIngredients,
  selectIngredientsError,
  selectIngredientsLoading,
} from '@slices/ingredientsSlice';
import { useDispatch, useSelector } from '@services/store';
import { Preloader } from '@ui';
import { useEffect } from 'react';

import styles from './constructor-page.module.css';

export const ConstructorPage = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIngredientsLoading);
  const error = useSelector(selectIngredientsError);

  useEffect(() => {
    void dispatch(fetchIngredients());
  }, [dispatch]);

  if (isLoading) return <Preloader />;
  if (error) return <p role="alert">Не удалось загрузить ингредиенты: {error}</p>;

  return (
    <main className={styles.containerMain}>
      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
        Соберите бургер
      </h1>
      <div className={`${styles.main} pl-5 pr-5`}>
        <BurgerIngredients />
        <BurgerConstructor />
      </div>
    </main>
  );
};
