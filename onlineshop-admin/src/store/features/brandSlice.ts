import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Brand } from '~/types/brand'
import { ErrorDTO } from '~/types/error'
import { PageParams, PageResponse } from '~/types/page'
import { RootState } from '..'
import api from '~/utils/api'
import { AxiosError } from 'axios'

export const getBrandsByPage = createAsyncThunk(
  'brand/getBrandsByPage',
  async (params: PageParams, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get<PageResponse<Brand>>('/brands/filters', {
        params
      })
      return fulfillWithValue(data)
    } catch (error) {
      const axiosError = error as AxiosError
      return rejectWithValue(axiosError.response?.data)
    }
  }
)

interface BrandState {
  brandPage: PageResponse<Brand> | null
  totalItems: number
  totalPages: number
  showModal: boolean
  isLoading: boolean
  error: ErrorDTO | null
}

const initialState: BrandState = {
  brandPage: null,
  totalItems: 0,
  totalPages: 0,
  showModal: false,
  isLoading: false,
  error: null
}

const brandSlice = createSlice({
  name: 'brand',
  initialState,
  reducers: {
    setShowModal: (state, { payload }: { payload: boolean }) => {
      state.showModal = payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBrandsByPage.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getBrandsByPage.fulfilled, (state, { payload }) => {
        state.isLoading = false
        state.brandPage = payload
        state.error = null
      })
      .addCase(getBrandsByPage.rejected, (state, { payload }) => {
        state.isLoading = false
        state.error = payload as ErrorDTO
      })
  }
})

export const { setShowModal } = brandSlice.actions
export const selectBrand = (state: RootState) => state.brand

const brandReducer = brandSlice.reducer
export default brandReducer
