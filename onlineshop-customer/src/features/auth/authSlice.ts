import { createSlice } from '@reduxjs/toolkit'
import { loginThunk, registerThunk } from './authThunk'
import { toast } from 'react-toastify'

export interface AuthState {
  accessToken: string | null
  loading: {
    login: boolean
    register: boolean
  }
}

const initialState: AuthState = {
  accessToken: localStorage.getItem('accessToken'),
  loading: {
    login: false,
    register: false
  }
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.accessToken = action.payload
      localStorage.setItem('accessToken', action.payload)
    },
    logout: (state) => {
      state.accessToken = null
      localStorage.removeItem('accessToken')
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading.login = true
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading.login = false
        toast.error(action.payload as string)
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading.login = false
        state.accessToken = action.payload.accessToken
        localStorage.setItem('accessToken', action.payload.accessToken)
      })
      .addCase(registerThunk.pending, (state) => {
        state.loading.register = true
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading.register = false
        toast.error(action.payload as string)
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.loading.register = false
        state.accessToken = action.payload.accessToken
        localStorage.setItem('accessToken', action.payload.accessToken)
      })
  }
})

export const { logout, setToken } = authSlice.actions

const authReducer = authSlice.reducer
export default authReducer
