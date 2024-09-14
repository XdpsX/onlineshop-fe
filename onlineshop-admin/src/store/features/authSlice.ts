import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import { LoginRequest } from '~/types/auth'
import api from '~/utils/api'
import { getErrorMsg, getRoleFromToken } from '~/utils/helper'
import { RootState } from '..'
import { ROLE_ADMIN } from '~/types/role'

export const loginAdminThunk = createAsyncThunk(
  'auth/loginThunk',
  async (loginRequest: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', loginRequest)
      const accessToken = response.data.accessToken
      if (getRoleFromToken(accessToken) !== ROLE_ADMIN) {
        return rejectWithValue('Người dùng không phải Admin')
      }

      return response.data
    } catch (error) {
      return rejectWithValue(getErrorMsg(error))
    }
  }
)

interface AuthState {
  accessToken: string | null
  loading: {
    loginThunk: boolean
  }
}

const initialState: AuthState = {
  accessToken: localStorage.getItem('accessToken'),
  loading: {
    loginThunk: false
  }
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.accessToken = null
      localStorage.removeItem('accessToken')
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdminThunk.pending, (state) => {
        state.loading.loginThunk = true
      })
      .addCase(loginAdminThunk.rejected, (state, action) => {
        state.loading.loginThunk = false
        toast.error(action.payload as string)
      })
      .addCase(loginAdminThunk.fulfilled, (state, action) => {
        state.loading.loginThunk = false
        state.accessToken = action.payload.accessToken
        localStorage.setItem('accessToken', action.payload.accessToken)
      })
  }
})

export const { logout } = authSlice.actions
export const selectAuth = (state: RootState) => state.auth
const authReducer = authSlice.reducer
export default authReducer
