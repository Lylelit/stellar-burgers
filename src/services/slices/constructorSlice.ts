import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '../store';
import type { TConstructorIngredient, TConstructorState } from '@utils-types';

const initialState: TConstructorState = {
  bun: null,
  ingredients: [],
};

const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<TConstructorIngredient>) => {
      if (action.payload.type === 'bun') state.bun = action.payload;
      else state.ingredients.push(action.payload);
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter((item) => item.id !== action.payload);
    },
    moveIngredient: (state, action: PayloadAction<{ from: number; to: number }>) => {
      const { from, to } = action.payload;
      if (from < 0 || from >= state.ingredients.length || to < 0 || to >= state.ingredients.length) return;
      const [item] = state.ingredients.splice(from, 1);
      state.ingredients.splice(to, 0, item);
    },
    clearConstructor: () => initialState,
  },
});

export const { addIngredient, removeIngredient, moveIngredient, clearConstructor } = constructorSlice.actions;
export const selectConstructor = (state: RootState): TConstructorState =>
  state.burgerConstructor;

export default constructorSlice.reducer;
