import { AxiosError } from 'axios'
import { ErrorDTO } from '~/types/error'

export const slugify = (text: string) => {
  const a = 'àáäâãåăæąçćčđďèéěėëêęğǵḧìíïîįłḿǹńňñòóöôœøṕŕřßşśšșťțùúüûǘůűūųẃẍÿýźžż·/_,:;'
  const b = 'aaaaaaaaacccddeeeeeeegghiiiiilmnnnnooooooprrsssssttuuuuuuuuuwxyyzzz------'
  const p = new RegExp(a.split('').join('|'), 'g')
  return text
    .toString()
    .toLowerCase()
    .replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a')
    .replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e')
    .replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i')
    .replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o')
    .replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u')
    .replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y')
    .replace(/đ/gi, 'd')
    .replace(/\s+/g, '-')
    .replace(p, (c) => b.charAt(a.indexOf(c)))
    .replace(/&/g, '-and-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

export const checkDuplicates = (list1: number[], list2: number[]) => {
  // Nếu độ dài khác nhau, không giống nhau
  if (list1.length !== list2.length) {
    return false
  }

  // Sắp xếp và so sánh hai danh sách
  const sortedList1 = [...list1].sort()
  const sortedList2 = [...list2].sort()

  for (let i = 0; i < sortedList1.length; i++) {
    if (sortedList1[i] !== sortedList2[i]) {
      return false // Nếu có bất kỳ phần tử nào khác nhau, không giống nhau
    }
  }

  return true // Nếu tất cả các phần tử đều giống nhau
}

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0, // Adjust this if you want to show decimal places
    maximumFractionDigits: 0
  }).format(price)
}

export const fromStringToBoolean = (str: string) => {
  if (!str) return null
  if (str === '0') return false
  return true
}

export const getErrorMsg = (error: unknown) => {
  const axiosError = error as AxiosError
  const errorDTO = axiosError.response?.data as ErrorDTO
  return errorDTO ? errorDTO.message : 'Internal Server Error'
}
