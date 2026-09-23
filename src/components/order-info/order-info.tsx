import { Preloader, OrderInfoUI } from '@ui';
import { fetchOrder, selectOrder } from '@slices/orderSlice';
import { fetchIngredients, selectIngredients } from '@slices/ingredientsSlice';
import { useDispatch, useSelector } from '@services/store';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import type { TIngredient } from '@utils-types';


export const OrderInfo = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const { number } = useParams<{ number: string }>();
  const { details: orderData, detailsLoading } = useSelector(selectOrder);
  const ingredients = useSelector(selectIngredients);

  useEffect(() => {
    void dispatch(fetchIngredients());
    const orderNumber = Number(number);
    void dispatch(fetchOrder(orderNumber));
  }, [dispatch, number]);

  /**
   * использование useMemo не обязательно
   */
  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = Record<string, TIngredient & { count: number }>;

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1,
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total,
    };
  }, [orderData, ingredients]);

  if (detailsLoading || !orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
