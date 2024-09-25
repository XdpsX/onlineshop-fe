import { AxiosError } from 'axios'

export const getErrorMsg = (error: unknown) => {
  const axiosError = error as AxiosError
  const errorDTO = axiosError.response?.data as Error
  return errorDTO ? errorDTO.message : 'Internal Server Error'
}

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price)
}
