import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { CategoryRequest } from '~/types/category'
import { slugify } from '~/utils/helper'
import debounce from 'lodash/debounce'
import { FaCheck, FaTimes } from 'react-icons/fa'
import { useAppDispatch, useAppSelector } from '~/store'
import {
  selectCategory,
  checkCategoryExists,
  updateCategory,
  createCategory,
  getCategoriesByPage
} from '~/store/features/categorySlice'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { DEFAULT_SORT } from '~/utils/data'

// Schema validation
const schema = yup.object().shape({
  name: yup.string().required('Vui lòng nhập tên').max(128, 'Tên tối đa 128 kí tự'),
  slug: yup.string().required('Vui lòng nhập slug').max(255, 'Slug tối đa 255 kí tự')
})

interface CategoryFormProps {
  isEditMode?: boolean
  closeModal: () => void
}

const CategoryForm = ({ isEditMode = false, closeModal }: CategoryFormProps) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { updateCategory: categoryToEdit } = useAppSelector(selectCategory)

  const [autoSlug, setAutoSlug] = useState(true)
  const [isChecking, setIsChecking] = useState(false)
  const [nameExists, setNameExists] = useState(false)
  const [slugExists, setSlugExists] = useState(false)
  const [isChanged, setIsChanged] = useState(false) // Trạng thái theo dõi sự thay đổi
  const [isProcessing, setIsProcessing] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors }
  } = useForm<CategoryRequest>({
    resolver: yupResolver(schema)
  })

  const name = watch('name')
  const slug = watch('slug')

  // Lưu trữ giá trị ban đầu khi ở chế độ chỉnh sửa
  const [initialName, setInitialName] = useState('')
  const [initialSlug, setInitialSlug] = useState('')

  useEffect(() => {
    if (isEditMode && categoryToEdit) {
      setValue('name', categoryToEdit.name)
      setValue('slug', categoryToEdit.slug)
      setInitialName(categoryToEdit.name)
      setInitialSlug(categoryToEdit.slug)
      setAutoSlug(false)
    }
  }, [isEditMode, categoryToEdit, setValue])

  useEffect(() => {
    if (autoSlug && name) {
      const generatedSlug = slugify(name)
      if (generatedSlug !== slug) {
        setValue('slug', generatedSlug)
        if (!generatedSlug) {
          setError('slug', { type: 'manual', message: 'Slug không hợp lệ' })
        } else {
          if (errors.slug) {
            setError('slug', { type: 'manual', message: '' })
          }
        }
      }
    }
  }, [name, autoSlug, setValue, setError, errors.slug, slug])

  useEffect(() => {
    const debouncedCheck = debounce(async (name: string, slug: string) => {
      if (name || slug) {
        // Chỉ kiểm tra nếu giá trị đã thay đổi
        if (isEditMode && name === initialName && slug === initialSlug) {
          setIsChecking(false)
          return
        }

        setIsChecking(true)
        const request = { name, slug }
        const resultAction = await dispatch(checkCategoryExists(request))
        if (checkCategoryExists.fulfilled.match(resultAction)) {
          const { nameExists, slugExists } = resultAction.payload
          setNameExists(nameExists)
          setSlugExists(slugExists)
        }
        setIsChecking(false)
      }
    }, 500)

    debouncedCheck(name, slug)

    return () => {
      debouncedCheck.cancel()
    }
  }, [name, slug, dispatch, isEditMode, initialName, initialSlug])

  // Kiểm tra sự thay đổi
  useEffect(() => {
    setIsChanged(name !== initialName || slug !== initialSlug)
  }, [name, slug, initialName, initialSlug])

  const onSubmit: SubmitHandler<CategoryRequest> = async (data) => {
    setIsProcessing(true)
    if (isEditMode) {
      console.log('Updating category:', data)
      if (!categoryToEdit) return
      const resultAction = await dispatch(updateCategory({ id: categoryToEdit.id, request: data }))
      if (updateCategory.fulfilled.match(resultAction)) {
        closeModal()
        navigate('/categories')
        toast.success('Cập nhật danh mục thành công')
        dispatch(getCategoriesByPage({ pageNum: 1, sort: DEFAULT_SORT, search: null }))
      }
    } else {
      console.log('Adding new category:', data)
      const resultAction = await dispatch(createCategory(data))
      if (createCategory.fulfilled.match(resultAction)) {
        closeModal()
        toast.success('Thêm danh mục thành công')
        navigate('/categories')
        dispatch(getCategoriesByPage({ pageNum: 1, sort: DEFAULT_SORT, search: null }))
      }
    }
    setIsProcessing(false)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='p-2'>
      <div className='mb-4'>
        <label htmlFor='name' className='block mb-2 text-lg font-medium text-gray-900 '>
          Name
        </label>
        <div className='relative mb-2'>
          <input
            id='name'
            {...register('name')}
            className='bg-gray-100 border border-gray-600 text-gray-900 text-lg rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
          />
          <div className='absolute -right-8 md:-right-10 top-1/2 transform -translate-y-1/2'>
            {isChecking && (
              <div className='h-6 w-6 animate-spin rounded-full border-4 border-solid border-t-transparent border-blue-600'></div>
            )}
            {name && !isChecking && !nameExists && <FaCheck color='green' size={20} />}
            {name && !isChecking && nameExists && <FaTimes color='red' size={20} />}
          </div>
        </div>
        {errors.name && <p className='text-sm text-red-600'>{errors.name.message}</p>}
      </div>
      <div className='mb-4'>
        <label htmlFor='slug' className='block mb-2 text-lg font-medium text-gray-900 '>
          Slug
        </label>
        <div className='relative mb-2'>
          <input
            id='slug'
            {...register('slug')}
            className='bg-gray-100 border border-gray-600 text-gray-900 text-lg rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
            onChange={(e) => {
              setAutoSlug(false)
              setValue('slug', e.target.value)
            }}
          />
          <div className='absolute -right-8 md:-right-10 top-1/2 transform -translate-y-1/2'>
            {isChecking && (
              <div className='h-6 w-6 animate-spin rounded-full border-4 border-solid border-t-transparent border-blue-600'></div>
            )}
            {slug && !isChecking && !slugExists && <FaCheck color='green' size={20} />}
            {slug && !isChecking && slugExists && <FaTimes color='red' size={20} />}
          </div>
        </div>
        {errors.slug && <p className='text-sm text-red-600'>{errors.slug.message}</p>}
      </div>
      <div className='flex items-center justify-center gap-3 mt-8'>
        {isProcessing || isChecking || nameExists || slugExists || (isEditMode && !isChanged) ? (
          <button
            type='submit'
            disabled
            className='text-white bg-gray-400 focus:ring-4 focus:outline-non font-medium rounded-lg text-xl px-8 py-2 text-center'
          >
            {isProcessing && 'Loading...'}
            {!isProcessing && (isEditMode ? 'Cập nhật' : 'Thêm')}
          </button>
        ) : (
          <button
            type='submit'
            className='text-white bg-green-500 focus:ring-4 focus:outline-non font-medium rounded-lg text-xl px-6 md:px-8 py-2 text-center'
          >
            {isEditMode ? 'Cập nhật' : 'Thêm'}
          </button>
        )}

        <button
          type='button'
          onClick={closeModal}
          className='text-white bg-gray-400 focus:ring-4 focus:outline-non font-medium rounded-lg text-xl px-6 md:px-8 py-2 text-center'
        >
          Huỷ
        </button>
      </div>
    </form>
  )
}

export default CategoryForm
