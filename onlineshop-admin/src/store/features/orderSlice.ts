import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ErrorDTO } from '~/types/error'
import { Order, OrderDetails, OrderParams } from '~/types/order'
import { PageResponse } from '~/types/page'
import { RootState } from '..'
import api from '~/utils/api'
import { AxiosError } from 'axios'
import { toast } from 'react-toastify'

export const getPageOrders = createAsyncThunk(
  'order/getCategoriesByPage',
  async (params: OrderParams, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get<PageResponse<Order>>('/orders', {
        params
      })
      return fulfillWithValue(data)
    } catch (error) {
      const axiosError = error as AxiosError
      return rejectWithValue(axiosError.response?.data)
    }
  }
)

export const updateOrderStatus = createAsyncThunk(
  'order/updateOrderStatus',
  async ({ id, status }: { id: number; status: string }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.patch(`/orders/${id}/status`, { status })
      return fulfillWithValue(data)
    } catch (error) {
      const axiosError = error as AxiosError
      return rejectWithValue(axiosError.response?.data)
    }
  }
)

export const getOrderDetails = createAsyncThunk(
  'order/getOrderDetails',
  async (id: number, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get<OrderDetails>(`/orders/${id}`)
      return fulfillWithValue(data)
    } catch (error) {
      const axiosError = error as AxiosError
      return rejectWithValue(axiosError.response?.data)
    }
  }
)

interface OrderState {
  orderPage: PageResponse<Order> | null
  orderDetails: OrderDetails | null
  isLoading: boolean
  isUpdating: boolean
  error: ErrorDTO | null
}

const initialState: OrderState = {
  orderPage: null,
  orderDetails: null,
  isLoading: false,
  isUpdating: false,
  error: null
}

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPageOrders.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getPageOrders.fulfilled, (state, { payload }) => {
        state.isLoading = false
        state.orderPage = payload
      })
      .addCase(getPageOrders.rejected, (state, { payload }) => {
        state.isLoading = false
        state.error = payload as ErrorDTO
      })
      .addCase(updateOrderStatus.pending, (state) => {
        state.isUpdating = true
      })
      .addCase(updateOrderStatus.fulfilled, (state, { payload }) => {
        state.isUpdating = false
        state.orderPage?.items?.forEach((order) => {
          if (order.id === payload.id) {
            order.status = payload.status
          }
        })
        toast.success('Cập nhật trạng thái đơn hàng thành công')
      })
      .addCase(updateOrderStatus.rejected, (state, { payload }) => {
        state.isUpdating = false
        state.error = payload as ErrorDTO
        toast.error('Cập nhật trạng thái đơn hàng thất bại')
      })
      .addCase(getOrderDetails.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getOrderDetails.fulfilled, (state, { payload }) => {
        state.isLoading = false
        state.orderDetails = payload
      })
      .addCase(getOrderDetails.rejected, (state, { payload }) => {
        state.isLoading = false
        state.error = payload as ErrorDTO
      })
  }
})

export const selectOrder = (state: RootState) => state.order

const orderReducer = orderSlice.reducer
export default orderReducer
