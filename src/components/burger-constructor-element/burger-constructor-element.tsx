import { BurgerConstructorElementUI } from '@ui';
import { moveIngredient, removeIngredient } from '@slices/constructorSlice';
import { useDispatch } from '@services/store';
import { memo } from 'react';

import type { BurgerConstructorElementProps } from './type';

export const BurgerConstructorElement = memo(function BurgerConstructorElement({
  ingredient,
  index,
  totalItems,
}: BurgerConstructorElementProps): React.JSX.Element {
  const dispatch = useDispatch();
  const handleMoveDown = (): void => {
    dispatch(moveIngredient({ from: index, to: index + 1 }));
  };

  const handleMoveUp = (): void => {
    dispatch(moveIngredient({ from: index, to: index - 1 }));
  };

  const handleClose = (): void => {
    dispatch(removeIngredient(ingredient.id));
  };

  return (
    <BurgerConstructorElementUI
      ingredient={ingredient}
      index={index}
      totalItems={totalItems}
      handleMoveUp={handleMoveUp}
      handleMoveDown={handleMoveDown}
      handleClose={handleClose}
    />
  );
});
