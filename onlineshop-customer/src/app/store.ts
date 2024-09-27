import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import userReducer from '../features/user/userSlice'
import productReducer from '../features/products/productSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    product: productReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
