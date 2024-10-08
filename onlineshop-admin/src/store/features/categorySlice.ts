import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { Category, CategoryRequest } from '~/types/category'
import api from '~/utils/api'
import { RootState } from '..'
import { PageParams, PageResponse } from '~/types/page'
import { ErrorDTO } from '~/types/error'

export const getCategoriesByPage = createAsyncThunk(
  'category/getCategoriesByPage',
  async (params: PageParams, { rejectWithValue, fulfillWithValue }) => {
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

export const checkCategoryExists = createAsyncThunk(
  'category/checkCategoryExists',
  async (request: CategoryRequest, { rejectWithValue, fulfillWithValue }) => {
    try {
      // Delay 1 giây trước khi gọi API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const { data } = await api.get('/categories/exists', {
        params: {
          name: request.name,
          slug: request.slug
        }
      })
      return fulfillWithValue(data)
    } catch (error) {
      const axiosError = error as AxiosError
      return rejectWithValue(axiosError.response?.data)
    }
  }
)

export const createCategory = createAsyncThunk(
  'category/createCategory',
  async (request: CategoryRequest, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post('/categories/create', request)
      return fulfillWithValue(data)
    } catch (error) {
      const axiosError = error as AxiosError
      return rejectWithValue(axiosError.response?.data)
    }
  }
)

export const updateCategory = createAsyncThunk(
  'category/updateCategory',
  async ({ id, request }: { id: number; request: CategoryRequest }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.put(`/categories/${id}/update`, request)
      return fulfillWithValue(data)
    } catch (error) {
      const axiosError = error as AxiosError
      return rejectWithValue(axiosError.response?.data)
    }
  }
)

export const deleteCategory = createAsyncThunk(
  'category/deleteCategory',
  async (categoryId: number, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.delete(`/categories/${categoryId}/delete`)
      return fulfillWithValue(data)
    } catch (error) {
      const axiosError = error as AxiosError
      return rejectWithValue(axiosError.response?.data)
    }
  }
)

export const getAllCategories = createAsyncThunk(
  'category/getAllCategories',
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get<Category[]>('/categories/get-all')
      return fulfillWithValue(data)
    } catch (error) {
      const axiosError = error as AxiosError
      return rejectWithValue(axiosError.response?.data)
    }
  }
)

interface CategoryState {
  categories: Category[] | null
  categoryPage: PageResponse<Category> | null
  totalItems: number
  totalPages: number
  updateCategory: Category | null
  deleteCategory: Category | null
  showModal: boolean
  isLoading: boolean
  error: ErrorDTO | null
}

const initialState: CategoryState = {
  categories: null,
  categoryPage: null,
  totalItems: 0,
  totalPages: 0,
  updateCategory: null,
  deleteCategory: null,
  showModal: false,
  isLoading: false,
  error: null
}

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setShowModal: (state, { payload }) => {
      state.showModal = payload
    },
    setUpdateCategory: (state, { payload }) => {
      state.updateCategory = payload
    },
    setDeleteCategory: (state, { payload }) => {
      state.deleteCategory = payload
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
      .addCase(getCategoriesByPage.rejected, (state, { payload }) => {
        state.isLoading = false
        state.error = payload as ErrorDTO
      })

      .addCase(createCategory.fulfilled, (state) => {
        state.error = null
      })
      .addCase(createCategory.rejected, (state, { payload }) => {
        state.error = payload as ErrorDTO
      })
      .addCase(updateCategory.fulfilled, (state) => {
        state.error = null
      })
      .addCase(updateCategory.rejected, (state, { payload }) => {
        state.error = payload as ErrorDTO
      })

      .addCase(getAllCategories.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getAllCategories.fulfilled, (state, { payload }) => {
        state.isLoading = false
        state.categories = payload
      })
      .addCase(getAllCategories.rejected, (state, { payload }) => {
        state.isLoading = false
        state.error = payload as ErrorDTO
      })
  }
})

export const { setShowModal, setUpdateCategory, setDeleteCategory } = categorySlice.actions
export const selectCategory = (state: RootState) => state.category

const categoryReducer = categorySlice.reducer
export default categoryReducer
