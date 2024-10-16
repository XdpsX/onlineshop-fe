import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import categoryReducer from './features/categorySlice'
import brandReducer from './features/brandSlice'
import productReducer from './features/productSlice'
import authReducer from './features/authSlice'
import userReducer from './features/userSlice'
import orderReducer from './features/orderSlice'

const store = configureStore({
  reducer: {
    category: categoryReducer,
    brand: brandReducer,
    product: productReducer,
    auth: authReducer,
    user: userReducer,
    order: orderReducer
  }
})

export type StoreType = typeof store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export default store
