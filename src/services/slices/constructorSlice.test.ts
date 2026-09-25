import constructorReducer, {
  addIngredient,
  clearConstructor,
  moveIngredient,
  removeIngredient,
} from './constructorSlice';

import type { TConstructorIngredient } from '@utils-types';

const bun: TConstructorIngredient = {
  _id: 'test-bun-a',
  id: 'bun-instance-a',
  name: 'Тестовая булка A',
  type: 'bun',
  proteins: 1,
  fat: 2,
  carbohydrates: 3,
  calories: 4,
  price: 100,
  image: '/vite.svg',
  image_large: '/vite.svg',
  image_mobile: '/vite.svg',
};

const filling: TConstructorIngredient = {
  ...bun,
  _id: 'test-main-a',
  id: 'main-instance-a',
  name: 'Тестовая начинка A',
  type: 'main',
};

const secondFilling: TConstructorIngredient = {
  ...filling,
  _id: 'test-main-b',
  id: 'main-instance-b',
  name: 'Тестовая начинка B',
};

describe('constructorSlice reducer', () => {
  it('возвращает начальное состояние для неизвестного экшена', () => {
    expect(constructorReducer(undefined, { type: 'UNKNOWN' })).toEqual({
      bun: null,
      ingredients: [],
    });
  });

  it('добавляет булку в пустой конструктор', () => {
    const state = constructorReducer(undefined, addIngredient(bun));

    expect(state.bun).toEqual(bun);
    expect(state.ingredients).toEqual([]);
  });

  it('добавляет начинку в список ингредиентов', () => {
    const state = constructorReducer(undefined, addIngredient(filling));

    expect(state.bun).toBeNull();
    expect(state.ingredients).toEqual([filling]);
  });

  it('заменяет выбранную булку другой', () => {
    const nextBun = { ...bun, _id: 'test-bun-b', id: 'bun-instance-b' };
    const initialState = constructorReducer(undefined, addIngredient(bun));

    const state = constructorReducer(initialState, addIngredient(nextBun));

    expect(state.bun).toEqual(nextBun);
    expect(state.ingredients).toEqual([]);
  });

  it('удаляет начинку по id', () => {
    const withFirst = constructorReducer(undefined, addIngredient(filling));
    const withBoth = constructorReducer(withFirst, addIngredient(secondFilling));

    const state = constructorReducer(withBoth, removeIngredient(filling.id));

    expect(state.ingredients).toEqual([secondFilling]);
  });

  it('меняет порядок начинок', () => {
    const withFirst = constructorReducer(undefined, addIngredient(filling));
    const withBoth = constructorReducer(withFirst, addIngredient(secondFilling));

    const state = constructorReducer(withBoth, moveIngredient({ from: 0, to: 1 }));

    expect(state.ingredients).toEqual([secondFilling, filling]);
  });

  it('очищает выбранную булку при сбросе конструктора', () => {
    const withBun = constructorReducer(undefined, addIngredient(bun));
    const filledState = constructorReducer(withBun, addIngredient(filling));

    expect(constructorReducer(filledState, clearConstructor())).toEqual({
      bun: null,
      ingredients: [],
    });
  });
});
