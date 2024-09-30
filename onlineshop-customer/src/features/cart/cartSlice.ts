import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'
import { addToCart, fetchCart, fetchNumberCartItems, removeCartItem, updateCartItem } from './cartThunk'
import { CartItem } from '../../models/cart/cartItem.type'
import { toast } from 'react-toastify'

interface CartState {
  totalItems: number | null
  cartItems: CartItem[] | null
  loading: {
    fetchNumberCartItems: boolean
    fetchCart: boolean
    removeCartItem: boolean
    updateCartItem: boolean
    addToCart: boolean
  }
}

const initialState: CartState = {
  totalItems: null,
  cartItems: null,
  loading: {
    fetchNumberCartItems: false,
    fetchCart: false,
    removeCartItem: false,
    updateCartItem: false,
    addToCart: false
  }
}

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    removeTotalItems: (state) => {
      state.totalItems = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNumberCartItems.pending, (state) => {
        state.loading.fetchNumberCartItems = true
      })
      .addCase(fetchNumberCartItems.fulfilled, (state, action) => {
        state.totalItems = action.payload
        state.loading.fetchNumberCartItems = false
      })
      .addCase(fetchNumberCartItems.rejected, (state) => {
        state.loading.fetchNumberCartItems = false
      })
      .addCase(fetchCart.pending, (state) => {
        state.loading.fetchCart = true
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.cartItems = action.payload
        state.loading.fetchCart = false
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading.fetchCart = false
        console.error(action.payload)
      })
      .addCase(removeCartItem.pending, (state) => {
        state.loading.removeCartItem = true
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        if (state.cartItems) {
          state.cartItems = state.cartItems.filter((item) => item.product.id !== action.payload)
        }
        state.loading.removeCartItem = false
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.loading.removeCartItem = false
        toast.error(action.payload as string)
      })

      .addCase(updateCartItem.pending, (state) => {
        state.loading.updateCartItem = true
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        if (state.cartItems) {
          state.cartItems = state.cartItems.map((item) => {
            if (item.product.id === action.payload.product.id) {
              return { ...item, quantity: action.payload.quantity }
            }
            return item
          })
        }
        state.loading.updateCartItem = false
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading.updateCartItem = false
        toast.error(action.payload as string)
      })

      .addCase(addToCart.pending, (state) => {
        state.loading.addToCart = true
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        if (action.payload === 1) {
          state.totalItems = state.totalItems ? state.totalItems + 1 : 1
        }
        state.loading.addToCart = false
        toast.success('Thêm vào giỏ hàng thành công')
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading.addToCart = false
        toast.error(action.payload as string)
      })
  }
})

export const { removeTotalItems } = cartSlice.actions
export const selectCart = (state: RootState) => state.cart
const cartReducer = cartSlice.reducer
export default cartReducer
