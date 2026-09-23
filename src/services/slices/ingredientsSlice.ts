import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getIngredientsApi } from '@api';

import type { RootState } from '../store';
import type { TIngredient } from '@utils-types';

type IngredientsState = {
  items: TIngredient[];
  isLoading: boolean;
  error: string | null;
};

const initialState: IngredientsState = {
  items: [],
  isLoading: false,
  error: null,
};

export const fetchIngredients = createAsyncThunk<TIngredient[]>(
  'ingredients/fetchIngredients',
  getIngredientsApi,
  {
    condition: (_, { getState }) => {
      const state = (getState() as RootState).ingredients;
      return !state.isLoading && state.items.length === 0;
    },
  }
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Не удалось загрузить ингредиенты';
      });
  },
});

export const selectIngredients = (state: RootState): TIngredient[] =>
  state.ingredients.items;
export const selectIngredientsLoading = (state: RootState): boolean =>
  state.ingredients.isLoading;
export const selectIngredientsError = (state: RootState): string | null =>
  state.ingredients.error;

export default ingredientsSlice.reducer;
