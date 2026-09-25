import { BurgerConstructorUI } from '@ui';
import { selectUser } from '@slices/authSlice';
import { selectConstructor } from '@slices/constructorSlice';
import { clearConstructor } from '@slices/constructorSlice';
import { clearOrder, createOrder, selectOrder } from '@slices/orderSlice';
import { useSelector } from '@services/store';
import { useDispatch } from '@services/store';
import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import type { TConstructorIngredient } from '@utils-types';

export const BurgerConstructor = (): React.JSX.Element | null => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const constructorItems = useSelector(selectConstructor);
  const { order: orderModalData, isLoading: orderRequest } = useSelector(selectOrder);

  const onOrderClick = (): void => {
    if (!user) {
      void navigate('/login', { state: { from: location } });
      return;
    }
    if (!constructorItems.bun || orderRequest) return;
    const ingredients = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id,
    ];
    void dispatch(createOrder(ingredients))
      .unwrap()
      .then(() => dispatch(clearConstructor()))
      .catch(() => undefined);
  };

  const closeOrderModal = (): void => {
    dispatch(clearOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
