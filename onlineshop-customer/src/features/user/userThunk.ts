import { createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'
import { getErrorMsg } from '../../utils/helper'

export const fetchUserProfile = createAsyncThunk('user/fetchUserProfile', async (_, thunkAPI) => {
  try {
    const response = await api.get('/users/me')
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMsg(error))
  }
})
