import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  getUserApi,
  loginUserApi,
  logoutApi,
  refreshToken,
  registerUserApi,
  updateUserApi,
} from '@api';
import { deleteCookie, getCookie, setCookie } from '@utils/cookie';

import type { TLoginData, TRegisterData } from '@api';
import type { RootState } from '../store';
import type { TUser } from '@utils-types';

type AuthState = {
  user: TUser | null;
  isChecked: boolean;
  isLoading: boolean;
  loginError: string | null;
  registerError: string | null;
  updateUserError: string | null;
};

const initialState: AuthState = {
  user: null,
  isChecked: false,
  isLoading: false,
  loginError: null,
  registerError: null,
  updateUserError: null,
};

export const checkAuth = createAsyncThunk<TUser | null>(
  'auth/checkAuth',
  async () => {
    if (!getCookie('accessToken') && !localStorage.getItem('refreshToken')) return null;
    if (!getCookie('accessToken')) await refreshToken();
    const response = await getUserApi();
    return response.user;
  },
  {
    condition: (_, { getState }) => {
      const { isChecked, isLoading } = (getState() as RootState).auth;
      return !isChecked && !isLoading;
    },
  }
);

export const login = createAsyncThunk<TUser, TLoginData>(
  'auth/login',
  async (credentials) => {
    const response = await loginUserApi(credentials);
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response.user;
  }
);

export const register = createAsyncThunk<TUser, TRegisterData>(
  'auth/register',
  async (data) => {
    const response = await registerUserApi(data);
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response.user;
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  const request = localStorage.getItem('refreshToken') ? logoutApi() : null;
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
  if (request) await request;
});

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (data: Partial<TRegisterData>) => {
    const response = await updateUserApi(data);
    return response;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.loginError = null;
      state.registerError = null;
      state.updateUserError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isChecked = true;
        state.user = action.payload;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.isChecked = true;
        state.user = null;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.loginError = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isChecked = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.loginError = action.error.message ?? 'Не удалось войти';
      })
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.registerError = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isChecked = true;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.registerError = action.error.message ?? 'Не удалось зарегистрироваться';
      })
      .addCase(logout.pending, (state) => {
        state.user = null;
        state.isChecked = true;
        state.isLoading = false;
        state.loginError = null;
        state.registerError = null;
        state.updateUserError = null;
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.updateUserError = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.updateUserError = action.error.message ?? 'Не удалось сохранить данные';
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export const selectAuth = (state: RootState): AuthState => state.auth;
export const selectUser = (state: RootState): TUser | null => state.auth.user;

export default authSlice.reducer;
