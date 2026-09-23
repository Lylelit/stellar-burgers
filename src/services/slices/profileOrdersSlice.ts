import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getOrdersApi } from '@api';
import type { RootState } from '../store';
import type { TOrder } from '@utils-types';

type ProfileOrdersState = {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
};

const initialState: ProfileOrdersState = {
  orders: [],
  isLoading: false,
  error: null,
};

export const fetchProfileOrders = createAsyncThunk<TOrder[]>(
  'profileOrders/fetch',
  getOrdersApi
);

const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfileOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchProfileOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Не удалось загрузить историю заказов';
      });
  },
});

export const selectProfileOrders = (state: RootState): ProfileOrdersState =>
  state.profileOrders;
export default profileOrdersSlice.reducer;
