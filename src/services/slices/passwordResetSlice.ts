import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { forgotPasswordApi, resetPasswordApi } from '@api';

import type { RootState } from '../store';

type PasswordResetState = {
  forgotLoading: boolean;
  forgotError: string | null;
  resetLoading: boolean;
  resetError: string | null;
};

const initialState: PasswordResetState = {
  forgotLoading: false,
  forgotError: null,
  resetLoading: false,
  resetError: null,
};

export const sendResetEmail = createAsyncThunk<void, { email: string }>(
  'passwordReset/request',
  async (data) => {
    await forgotPasswordApi(data);
  }
);

export const confirmPasswordReset = createAsyncThunk<
  void,
  { password: string; token: string }
>('passwordReset/confirm', async (data) => {
  await resetPasswordApi(data);
});

const passwordResetSlice = createSlice({
  name: 'passwordReset',
  initialState,
  reducers: {
    clearPasswordResetErrors: (state) => {
      state.forgotError = null;
      state.resetError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendResetEmail.pending, (state) => {
        state.forgotLoading = true;
        state.forgotError = null;
      })
      .addCase(sendResetEmail.fulfilled, (state) => {
        state.forgotLoading = false;
      })
      .addCase(sendResetEmail.rejected, (state, action) => {
        state.forgotLoading = false;
        state.forgotError = action.error.message ?? 'Не удалось отправить письмо';
      })
      .addCase(confirmPasswordReset.pending, (state) => {
        state.resetLoading = true;
        state.resetError = null;
      })
      .addCase(confirmPasswordReset.fulfilled, (state) => {
        state.resetLoading = false;
      })
      .addCase(confirmPasswordReset.rejected, (state, action) => {
        state.resetLoading = false;
        state.resetError = action.error.message ?? 'Не удалось изменить пароль';
      });
  },
});

export const { clearPasswordResetErrors } = passwordResetSlice.actions;
export const selectPasswordReset = (state: RootState): PasswordResetState =>
  state.passwordReset;

export default passwordResetSlice.reducer;
