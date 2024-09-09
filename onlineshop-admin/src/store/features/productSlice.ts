import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ErrorDTO } from '~/types/error'
import { PageResponse } from '~/types/page'
import { Product, ProductParams } from '~/types/product'
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

interface ProductState {
  params: ProductParams
  productPage: PageResponse<Product> | null
  totalItems: number
  totalPages: number
  isLoading: boolean
  error: ErrorDTO | null
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
  error: null
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
          // Tìm sản phẩm dựa trên id từ payload
          const productIndex = state.productPage.items.findIndex((product) => product.id === payload)

          // Nếu tìm thấy sản phẩm
          if (productIndex !== -1) {
            // Cập nhật published thành giá trị ngược lại
            state.productPage.items[productIndex].published = !state.productPage.items[productIndex].published
          }
        }
      })
      .addCase(publishProduct.rejected, (state, { payload }) => {
        state.error = payload as ErrorDTO
      })
  }
})

export const { updateProductParams, resetProductParams } = productSlice.actions
export const selectProduct = (state: RootState) => state.product
const productReducer = productSlice.reducer
export default productReducer
