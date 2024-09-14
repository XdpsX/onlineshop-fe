import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '~/utils/api'
import { UserProfile } from '~/types/user'
import { getErrorMsg } from '~/utils/helper'
import { toast } from 'react-toastify'
import { RootState } from '..'

export const getProfileThunk = createAsyncThunk('user/getProfileThunk', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/users/me')
    return response.data
  } catch (error) {
    return rejectWithValue(getErrorMsg(error))
  }
})

interface UserState {
  userProfile: UserProfile | null
  loading: {
    getProfileThunk: boolean
  }
}
const initialState: UserState = {
  userProfile: null,
  loading: {
    getProfileThunk: false
  }
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProfileThunk.pending, (state) => {
        state.loading.getProfileThunk = true
      })
      .addCase(getProfileThunk.rejected, (state, action) => {
        state.loading.getProfileThunk = false
        toast.error(action.payload as string)
      })
      .addCase(getProfileThunk.fulfilled, (state, action) => {
        state.loading.getProfileThunk = false
        state.userProfile = action.payload
      })
  }
})

export const selectUser = (state: RootState) => state.user
const userReducer = userSlice.reducer
export default userReducer
