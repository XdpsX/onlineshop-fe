import { AxiosError } from 'axios'

export const getErrorMsg = (error: unknown) => {
  const axiosError = error as AxiosError
  const errorDTO = axiosError.response?.data as Error
  return errorDTO ? errorDTO.message : 'Internal Server Error'
}
