import { createSlice } from '@reduxjs/toolkit'
import { UserProfile } from '../../models/user/profile.type'
import { fetchUserProfile } from './userThunk'
import { RootState } from '../../app/store'

interface UserState {
  profile: UserProfile | null
  loading: {
    fetchUserProfile: boolean
  }
}

const initialState: UserState = {
  profile: null,
  loading: {
    fetchUserProfile: false
  }
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    removeProfile: (state) => {
      state.profile = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading.fetchUserProfile = true
      })
      .addCase(fetchUserProfile.rejected, (state) => {
        state.loading.fetchUserProfile = false
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading.fetchUserProfile = false
        state.profile = action.payload
      })
  }
})

export const { removeProfile } = userSlice.actions
export const selectUser = (state: RootState) => state.user
const userReducer = userSlice.reducer
export default userReducer
