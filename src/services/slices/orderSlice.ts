import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getOrderByNumberApi, orderBurgerApi } from '@api';
import { fetchFeed } from './feedSlice';
import { fetchProfileOrders } from './profileOrdersSlice';
import type { RootState } from '../store';
import type { TOrder } from '@utils-types';

type OrderState = {
  order: TOrder | null;
  isLoading: boolean;
  error: string | null;
  details: TOrder | null;
  detailsLoading: boolean;
  detailsError: string | null;
};

const initialState: OrderState = {
  order: null,
  isLoading: false,
  error: null,
  details: null,
  detailsLoading: false,
  detailsError: null,
};

export const createOrder = createAsyncThunk<TOrder, string[]>(
  'order/create',
  async (ingredients, { dispatch }) => {
    const response = await orderBurgerApi(ingredients);
    void dispatch(fetchFeed());
    void dispatch(fetchProfileOrders());
    return response.order;
  }
);

export const fetchOrder = createAsyncThunk<TOrder, number>(
  'order/fetchByNumber',
  async (number) => {
    const response = await getOrderByNumberApi(number);
    const order = response.orders[0];
    if (!order) throw new Error('Заказ не найден');
    return order;
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.order = null;
      state.error = null;
      state.details = null;
      state.detailsError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Не удалось оформить заказ';
      })
      .addCase(fetchOrder.pending, (state) => {
        state.detailsLoading = true;
        state.detailsError = null;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.details = action.payload;
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.detailsLoading = false;
        state.detailsError = action.error.message ?? 'Не удалось загрузить заказ';
      });
  },
});

export const { clearOrder } = orderSlice.actions;
export const selectOrder = (state: RootState): OrderState => state.order;
export default orderSlice.reducer;
