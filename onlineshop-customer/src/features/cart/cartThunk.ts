import { createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'
import { getErrorMsg } from '../../utils/helper'
import { CartItemNew } from '../../models/cart/cartItemNew.type'

export const fetchNumberCartItems = createAsyncThunk('cart/fetchNumberCartItems', async (_, thunkAPI) => {
  try {
    const response = await api.get('/cart/count')
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMsg(error))
  }
})

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, thunkAPI) => {
  try {
    const response = await api.get('/cart')
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMsg(error))
  }
})

export const removeCartItem = createAsyncThunk('cart/removeCartItem', async (productId: number, thunkAPI) => {
  try {
    await api.delete(`/cart/remove/${productId}`)
    return productId
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMsg(error))
  }
})

export const updateCartItem = createAsyncThunk('cart/updateCartItem', async (newCartItem: CartItemNew, thunkAPI) => {
  try {
    const response = await api.put('/cart/update', newCartItem)
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMsg(error))
  }
})

export const addToCart = createAsyncThunk('cart/addToCart', async (newCartItem: CartItemNew, thunkAPI) => {
  try {
    const response = await api.post('/cart/add', newCartItem)
    if (response.data.quantity === newCartItem.quantity) {
      return 1
    } else {
      return 0
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMsg(error))
  }
})
