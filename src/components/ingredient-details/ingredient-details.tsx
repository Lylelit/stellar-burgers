import { Preloader, IngredientDetailsUI } from '@ui';
import {
  fetchIngredients,
  selectIngredients,
  selectIngredientsError,
} from '@slices/ingredientsSlice';
import { useDispatch, useSelector } from '@services/store';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

export const IngredientDetails = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const ingredients = useSelector(selectIngredients);
  const error = useSelector(selectIngredientsError);
  const ingredientData = ingredients.find((item) => item._id === id);

  useEffect(() => {
    void dispatch(fetchIngredients());
  }, [dispatch]);

  if (!ingredientData) {
    if (error) return <p role="alert">{error}</p>;
    return !ingredients.length ? (
      <Preloader />
    ) : (
      <h3 className="pb-6 text text_type_main-large">Страница не найдена. Ошибка 404.</h3>
    );
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
