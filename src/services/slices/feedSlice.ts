import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getFeedsApi } from '@api';

import type { RootState } from '../store';
import type { TOrder } from '@utils-types';

type FeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
};

const initialState: FeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null,
};

export const fetchFeed = createAsyncThunk('feed/fetchFeed', getFeedsApi, {
  condition: (_, { getState }) => !(getState() as RootState).feed.isLoading,
});

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Не удалось загрузить ленту заказов';
      });
  },
});

export const selectFeed = (state: RootState): FeedState => state.feed;

export default feedSlice.reducer;
