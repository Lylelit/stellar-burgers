import { combineReducers } from '@reduxjs/toolkit';

import authReducer from './slices/authSlice';
import constructorReducer from './slices/constructorSlice';
import feedReducer from './slices/feedSlice';
import ingredientsReducer from './slices/ingredientsSlice';
import orderReducer from './slices/orderSlice';
import passwordResetReducer from './slices/passwordResetSlice';
import profileOrdersReducer from './slices/profileOrdersSlice';

export const rootReducer = combineReducers({
  auth: authReducer,
  burgerConstructor: constructorReducer,
  feed: feedReducer,
  ingredients: ingredientsReducer,
  order: orderReducer,
  passwordReset: passwordResetReducer,
  profileOrders: profileOrdersReducer,
});
