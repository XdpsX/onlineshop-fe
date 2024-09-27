import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'

interface ProductState {
  pageNum: number
  brandIds: number[] | null
  sort: string | null
  minPrice: number | null
  maxPrice: number | null
}

const initialState: ProductState = {
  pageNum: 1,
  brandIds: null,
  sort: null,
  minPrice: null,
  maxPrice: null
}

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setPageNum: (state, action) => {
      state.pageNum = action.payload
    },
    setBrandIds: (state, action) => {
      state.brandIds = action.payload
    },
    setSort: (state, action) => {
      state.sort = action.payload
    },
    setPrices: (state, action) => {
      state.minPrice = action.payload[0]
      state.maxPrice = action.payload[1]
    },
    resetFilters: (state) => {
      state.pageNum = 1
      state.brandIds = null
      state.minPrice = null
      state.maxPrice = null
      state.sort = null
    }
  }
})

export const { setPageNum, setBrandIds, setSort, setPrices, resetFilters } = productSlice.actions
export const selectProduct = (state: RootState) => state.product
const productReducer = productSlice.reducer
export default productReducer
