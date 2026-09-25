import ingredientsReducer, { fetchIngredients } from './ingredientsSlice';

import type { TIngredient } from '@utils-types';

const ingredient: TIngredient = {
  _id: 'test-bun-a',
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

const requestId = 'test-request';

describe('ingredientsSlice reducer', () => {
  it('возвращает начальное состояние для неизвестного экшена', () => {
    expect(ingredientsReducer(undefined, { type: 'UNKNOWN' })).toEqual({
      items: [],
      isLoading: false,
      error: null,
    });
  });

  it('отмечает загрузку при fetchIngredients.pending', () => {
    const state = ingredientsReducer(
      { items: [], isLoading: false, error: 'Предыдущая ошибка' },
      fetchIngredients.pending(requestId, undefined)
    );

    expect(state).toEqual({ items: [], isLoading: true, error: null });
  });

  it('сохраняет ингредиенты при fetchIngredients.fulfilled', () => {
    const loadingState = ingredientsReducer(
      undefined,
      fetchIngredients.pending(requestId, undefined)
    );

    const state = ingredientsReducer(
      loadingState,
      fetchIngredients.fulfilled([ingredient], requestId, undefined)
    );

    expect(state).toEqual({
      items: [ingredient],
      isLoading: false,
      error: null,
    });
  });

  it('сохраняет сообщение об ошибке при fetchIngredients.rejected', () => {
    const loadingState = ingredientsReducer(
      undefined,
      fetchIngredients.pending(requestId, undefined)
    );

    const state = ingredientsReducer(
      loadingState,
      fetchIngredients.rejected(new Error('Ошибка сети'), requestId, undefined)
    );

    expect(state).toEqual({
      items: [],
      isLoading: false,
      error: 'Ошибка сети',
    });
  });
});
