import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { Category, CategoryParams } from '~/types/category'
import api from '~/utils/api'
import { RootState } from '..'
import { PageResponse } from '~/types/pageResponse'
import { DEFAULT_SORT } from '~/utils/data'

export const getCategoriesByPage = createAsyncThunk(
  'category/getCategoriesByPage',
  async (params: CategoryParams, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get<PageResponse<Category>>('/categories/filters', {
        params
      })
      return fulfillWithValue(data)
    } catch (error) {
      const axiosError = error as AxiosError
      return rejectWithValue(axiosError.response?.data)
    }
  }
)

interface CategoryState {
  categoryPage: PageResponse<Category>
  params: CategoryParams
  categories: Category[]
  isLoading: boolean
  totalItems: number
  totalPages: number
}

const initialState: CategoryState = {
  categoryPage: {
    items: [],
    pageNum: 0,
    pageSize: 0,
    totalItems: 0,
    totalPages: 0
  },
  params: {
    pageNum: 1,
    pageSize: 7,
    search: null,
    sort: DEFAULT_SORT
  },
  totalItems: 0,
  totalPages: 0,
  categories: [],
  isLoading: false
}

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    updateParams: (state, { payload }) => {
      state.params = payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCategoriesByPage.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getCategoriesByPage.fulfilled, (state, { payload }) => {
        state.isLoading = false
        state.categoryPage = payload
      })
      .addCase(getCategoriesByPage.rejected, (state) => {
        state.isLoading = false
      })
  }
})

export const { updateParams } = categorySlice.actions
export const selectCategory = (state: RootState) => state.category

const categoryReducer = categorySlice.reducer
export default categoryReducer
