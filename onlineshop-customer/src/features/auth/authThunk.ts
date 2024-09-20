import { createAsyncThunk } from '@reduxjs/toolkit'
import { LoginRequest } from '../../models/auth/login.type'
import { RegisterRequest } from '../../models/auth/register.type'
import api from '../../services/api'
import { getErrorMsg } from '../../utils/helper'

export const loginThunk = createAsyncThunk('auth/loginThunk', async (payload: LoginRequest, thunkAPI) => {
  try {
    const response = await api.post('/auth/login', payload)
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMsg(error))
  }
})

export const registerThunk = createAsyncThunk('auth/registerThunk', async (payload: RegisterRequest, thunkAPI) => {
  try {
    const response = await api.post('/auth/register', payload)
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMsg(error))
  }
})
