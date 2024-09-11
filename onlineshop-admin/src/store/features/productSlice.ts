import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ErrorDTO } from '~/types/error'
import { PageResponse } from '~/types/page'
import { Product, ProductCreate, ProductParams } from '~/types/product'
import { RootState } from '..'
import api from '~/utils/api'
import { AxiosError } from 'axios'
import { DEFAULT_SORT } from '~/utils/data'

export const getProductsPage = createAsyncThunk(
  'product/getProductsPage',
  async (params: ProductParams, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get<PageResponse<Product>>('/products', {
        params
      })
      return fulfillWithValue(data)
    } catch (error) {
      const axiosError = error as AxiosError
      return rejectWithValue(axiosError.response?.data)
    }
  }
)

export const publishProduct = createAsyncThunk(
  'product/publishProduct',
  async ({ id, status }: { id: number; status: boolean }, { rejectWithValue, fulfillWithValue }) => {
    try {
      await api.patch(`/products/${id}/public/${status}`)
      return fulfillWithValue(id)
    } catch (error) {
      const axiosError = error as AxiosError
      return rejectWithValue(axiosError.response?.data)
    }
  }
)

export const checkProductExists = createAsyncThunk(
  'product/checkProductExists',
  async ({ slug }: { slug: string }, { rejectWithValue, fulfillWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const { data } = await api.get('/products/exists', {
        params: {
          slug
        }
      })
      return fulfillWithValue(data)
    } catch (error) {
      const axiosError = error as AxiosError
      return rejectWithValue(axiosError.response?.data)
    }
  }
)

export const createProduct = createAsyncThunk(
  'product/createProduct',
  async (request: ProductCreate, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post('/products/create', request, {
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

interface ProductState {
  params: ProductParams
  productPage: PageResponse<Product> | null
  totalItems: number
  totalPages: number
  isLoading: boolean
  error: ErrorDTO | null
  isChecking: boolean
  exists: {
    slugExists: boolean
  }
}

const initialState: ProductState = {
  params: {
    pageNum: 1,
    search: null,
    sort: DEFAULT_SORT,
    minPrice: null,
    maxPrice: null,
    hasDiscount: null,
    hasPublished: null,
    inStock: null,
    brandId: null,
    categoryId: null
  },
  productPage: null,
  totalItems: 0,
  totalPages: 0,
  isLoading: false,
  error: null,
  isChecking: false,
  exists: {
    slugExists: false
  }
}

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    updateProductParams: (state, action) => {
      state.params = action.payload
    },
    resetProductParams: (state) => {
      state.params = initialState.params
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProductsPage.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getProductsPage.fulfilled, (state, { payload }) => {
        state.isLoading = false
        state.productPage = payload
      })
      .addCase(getProductsPage.rejected, (state, { payload }) => {
        state.isLoading = false
        state.error = payload as ErrorDTO
      })

      .addCase(publishProduct.fulfilled, (state, { payload }) => {
        if (state.productPage) {
          const productIndex = state.productPage.items.findIndex((product) => product.id === payload)

          if (productIndex !== -1) {
            state.productPage.items[productIndex].published = !state.productPage.items[productIndex].published
          }
        }
      })
      .addCase(publishProduct.rejected, (state, { payload }) => {
        state.error = payload as ErrorDTO
      })

      .addCase(checkProductExists.pending, (state) => {
        state.isChecking = true
      })
      .addCase(checkProductExists.fulfilled, (state, { payload }) => {
        state.isChecking = false
        state.exists = payload
      })
      .addCase(checkProductExists.rejected, (state, { payload }) => {
        state.isChecking = false
        state.error = payload as ErrorDTO
      })

      .addCase(createProduct.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createProduct.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(createProduct.rejected, (state, { payload }) => {
        state.isLoading = false
        state.error = payload as ErrorDTO
      })
  }
})

export const { updateProductParams, resetProductParams } = productSlice.actions
export const selectProduct = (state: RootState) => state.product
const productReducer = productSlice.reducer
export default productReducer
