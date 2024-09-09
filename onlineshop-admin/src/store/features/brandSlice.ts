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

export const checkBrandExists = createAsyncThunk(
  'brand/checkCategoryExists',
  async ({ name }: { name: string }, { rejectWithValue, fulfillWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const { data } = await api.get('/brands/exists', {
        params: {
          name
        }
      })
      return fulfillWithValue(data)
    } catch (error) {
      const axiosError = error as AxiosError
      return rejectWithValue(axiosError.response?.data)
    }
  }
)

export const createBrand = createAsyncThunk(
  'brand/createBrand',
  async (request: FormData, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post('/brands/create', request, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return fulfillWithValue(data)
    } catch (error) {
      const axiosError = error as AxiosError
      return rejectWithValue(axiosError.response?.data)
    }
  }
)

export const updateBrand = createAsyncThunk(
  'brand/updateBrand',
  async ({ id, request }: { id: number; request: FormData }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.put(`/brands/${id}/update`, request, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return fulfillWithValue(data)
    } catch (error) {
      const axiosError = error as AxiosError
      return rejectWithValue(axiosError.response?.data)
    }
  }
)

export const deleteBrand = createAsyncThunk(
  'brand/deleteBrand',
  async (brandId: number, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.delete(`/brands/${brandId}/delete`)
      return fulfillWithValue(data)
    } catch (error) {
      const axiosError = error as AxiosError
      return rejectWithValue(axiosError.response?.data)
    }
  }
)

export const getBrandsByCategoryId = createAsyncThunk(
  'brand/getBrandsByCategoryId',
  async (categoryId: number, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get<Omit<Brand, 'categories'>[]>(`/categories/${categoryId}/brands`)
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
  updateBrand: Brand | null
  deleteBrand: Brand | null
  showModal: boolean
  isLoading: boolean
  error: ErrorDTO | null
  catBrands: Omit<Brand, 'categories'>[] | null
}

const initialState: BrandState = {
  brandPage: null,
  totalItems: 0,
  totalPages: 0,
  updateBrand: null,
  deleteBrand: null,
  showModal: false,
  isLoading: false,
  error: null,
  catBrands: null
}

const brandSlice = createSlice({
  name: 'brand',
  initialState,
  reducers: {
    setShowModal: (state, { payload }: { payload: boolean }) => {
      state.showModal = payload
    },
    setUpdateBrand: (state, { payload }) => {
      state.updateBrand = payload
    },
    setDeleteBrand: (state, { payload }) => {
      state.deleteBrand = payload
    },
    resetCatBrands: (state) => {
      state.catBrands = initialState.catBrands
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
      })
      .addCase(getBrandsByPage.rejected, (state, { payload }) => {
        state.isLoading = false
        state.error = payload as ErrorDTO
      })

      .addCase(createBrand.fulfilled, (state) => {
        state.error = null
      })
      .addCase(createBrand.rejected, (state, { payload }) => {
        state.error = payload as ErrorDTO
      })

      .addCase(updateBrand.fulfilled, (state) => {
        state.error = null
      })
      .addCase(updateBrand.rejected, (state, { payload }) => {
        state.error = payload as ErrorDTO
      })

      .addCase(getBrandsByCategoryId.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getBrandsByCategoryId.fulfilled, (state, { payload }) => {
        state.isLoading = false
        state.catBrands = payload
      })
      .addCase(getBrandsByCategoryId.rejected, (state, { payload }) => {
        state.isLoading = false
        state.error = payload as ErrorDTO
      })
  }
})

export const { setShowModal, setUpdateBrand, setDeleteBrand, resetCatBrands } = brandSlice.actions
export const selectBrand = (state: RootState) => state.brand

const brandReducer = brandSlice.reducer
export default brandReducer
