import debounce from 'lodash/debounce'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '~/store'
import {
  checkBrandExists,
  getBrandsByPage,
  selectBrand,
  setUpdateBrand,
  updateBrand
} from '~/store/features/brandSlice'
import { getAllCategories } from '~/store/features/categorySlice'
import { BrandRequest } from '~/types/brand'
import { FaTimes, FaCheck } from 'react-icons/fa'
import { Modal } from '../common'
import { toast } from 'react-toastify'
import { DEFAULT_SORT } from '~/utils/data'
import { checkDuplicates } from '~/utils/helper'

const EditBrand = () => {
  const dispatch = useAppDispatch()
  const setSearchParams = useSearchParams()[1]
  const { updateBrand: brandToEdit } = useAppSelector(selectBrand)

  const [categories, setCategories] = useState<{ id: number; name: string }[]>([])
  const [isLoadingCats, setIsLoadingCats] = useState(true)
  const [isChecking, setIsChecking] = useState(false)
  const [nameExists, setNameExists] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [selectedCategories, setSelectedCategories] = useState<{ id: number; name: string }[]>([])
  const [isChanged, setIsChanged] = useState(false)
  const [shouldCheckExists, setShouldCheckExists] = useState(false)

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    watch,
    reset,
    clearErrors,
    formState: { errors }
  } = useForm<BrandRequest>()

  const name = watch('name')
  const selectedLogo = watch('logo')

  useEffect(() => {
    if (brandToEdit) {
      setValue('name', brandToEdit.name)
      // setInitialName(brandToEdit.name)
      setLogoPreview(brandToEdit.logo)
      setSelectedCategories(
        brandToEdit.categories.map((category: { id: number; name: string }) => ({
          id: category.id,
          name: category.name
        }))
      )
    }
  }, [brandToEdit, setValue])

  // Fetch list categories from the API
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCats(true)
      const resultAction = await dispatch(getAllCategories())
      if (getAllCategories.fulfilled.match(resultAction)) {
        setCategories(resultAction.payload)
      }
      setIsLoadingCats(false)
    }
    fetchCategories()
  }, [dispatch])

  // Validate logo when selected
  useEffect(() => {
    if (selectedLogo instanceof FileList && selectedLogo.length > 0) {
      const file = selectedLogo[0]

      // Validate file type
      if (!['image/png', 'image/jpeg'].includes(file.type)) {
        setError('logo', {
          type: 'manual',
          message: 'Chỉ chấp nhận png/jpg'
        })
      }
      // Validate file size
      else if (file.size > 2000000) {
        setError('logo', {
          type: 'manual',
          message: 'Dung lượng tối đa 2MB'
        })
      }
      // Validate file width
      else {
        const reader = new FileReader()
        reader.onload = (e) => {
          const img = new Image()
          img.onload = () => {
            if (img.width <= 320) {
              setError('logo', {
                type: 'manual',
                message: 'Chiều rộng ảnh phải lớn hơn 320px'
              })
            } else {
              clearErrors('logo')
              setLogoPreview(URL.createObjectURL(file))
            }
          }
          img.src = e.target?.result as string
        }
        reader.readAsDataURL(file)
      }
    }
  }, [selectedLogo, setError, clearErrors, brandToEdit?.logo, logoPreview])

  useEffect(() => {
    if (brandToEdit?.name !== null && name !== brandToEdit?.name) {
      setShouldCheckExists(true)
    } else {
      setShouldCheckExists(false)
    }
    if (shouldCheckExists) {
      const debouncedCheck = debounce(async (name: string) => {
        if (name) {
          setIsChecking(true)
          const resultAction = await dispatch(checkBrandExists({ name }))
          if (checkBrandExists.fulfilled.match(resultAction)) {
            const { nameExists } = resultAction.payload
            setNameExists(nameExists)
          }
          setIsChecking(false)
        }
      }, 500)

      debouncedCheck(name)

      return () => {
        debouncedCheck.cancel()
      }
    } else {
      setNameExists(false)
    }
  }, [name, dispatch, brandToEdit?.name, shouldCheckExists])

  useEffect(() => {
    if (!brandToEdit) return

    // So sánh các giá trị hiện tại với giá trị ban đầu
    const hasNameChanged = name !== brandToEdit.name
    const hasLogoChanged = selectedLogo && !(selectedLogo instanceof FileList && selectedLogo.length === 0)

    const selectedCatIds = selectedCategories.map((cat) => cat.id)
    const brandCatIds = brandToEdit.categories.map((cat) => cat.id)
    // const hasCategoriesChanged =
    //   selectedCategories.length !== brandToEdit.categories.length ||
    //   selectedCategories.some((cat) => !brandToEdit.categories.some((initialCat) => initialCat.id === cat.id))
    const hasCategoriesChanged = !checkDuplicates(selectedCatIds, brandCatIds)

    // Cập nhật trạng thái isChanged khi bất kỳ trường nào thay đổi
    if (hasNameChanged || hasLogoChanged || hasCategoriesChanged) {
      setIsChanged(true)
    } else {
      setIsChanged(false)
    }
  }, [name, selectedLogo, selectedCategories, brandToEdit])

  const handleCategorySelect = (categoryId: number, categoryName: string) => {
    if (!selectedCategories.find((c) => c.id === categoryId)) {
      setSelectedCategories((prevCategories) => [...prevCategories, { id: categoryId, name: categoryName }])
      clearErrors('categoryIds')
      // setIsChanged(true)
    }
  }
  const handleRemoveCategory = (categoryId: number) => {
    setSelectedCategories((prevCategories) => prevCategories.filter((c) => c.id !== categoryId))
    // setIsChanged(true)
  }

  const onSubmit = async (data: BrandRequest) => {
    if (!brandToEdit) return

    let hasError = false

    // Validate name
    if (!data.name) {
      setError('name', {
        type: 'manual',
        message: 'Vui lòng nhập tên'
      })
      hasError = true
    } else if (data.name.length > 128) {
      setError('name', {
        type: 'manual',
        message: 'Tên tối đa 128 kí tự'
      })
      hasError = true
    } else {
      clearErrors('name')
    }

    if (!logoPreview) {
      setError('logo', {
        type: 'manual',
        message: 'Vui lòng chọn logo'
      })
    }

    // Validate categoryIds
    if (selectedCategories.length === 0) {
      setError('categoryIds', {
        type: 'manual',
        message: 'Vui lòng chọn ít nhất 1 category'
      })
      hasError = true
    } else {
      clearErrors('categoryIds')
    }

    // Nếu có lỗi thì dừng submit
    if (hasError) return

    // Nếu không có lỗi, tiếp tục xử lý form
    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('categoryIds', selectedCategories.map((category) => category.id).join(','))

    // Append logo if present
    if (selectedLogo instanceof FileList && selectedLogo.length > 0) {
      formData.append('logo', selectedLogo[0])
    }

    setIsProcessing(true)
    const resultAction = await dispatch(updateBrand({ id: brandToEdit.id, request: formData }))
    if (updateBrand.fulfilled.match(resultAction)) {
      closeModal()
      toast.success('Cập nhật thương hiệu thành công')
      setSearchParams({ pageNum: '1', sort: DEFAULT_SORT })
      dispatch(getBrandsByPage({ pageNum: 1, sort: DEFAULT_SORT, search: null }))
    }
    setIsProcessing(false)
  }

  const closeModal = () => {
    reset()
    setLogoPreview(null)
    setSelectedCategories([])
    dispatch(setUpdateBrand(null))
  }

  if (!brandToEdit) return
  console.log(isChanged)
  return (
    <Modal isOpen={brandToEdit !== null} onClose={closeModal}>
      <div className='ps-2 md:ps-8 pe-8 md:pe-10 py-4'>
        <div className='py-2 md:p-5 border-b'>
          <h3 className='text-2xl md:text-3xl font-semibold text-gray-900 text-center'>Cập nhật thương hiệu</h3>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className='p-2 md:w-[400px]'>
          <div className='mb-4'>
            <label htmlFor='name' className='block mb-2 text-lg font-medium text-gray-900'>
              Tên thương hiệu
            </label>
            <div className='relative mb-2'>
              <input
                id='name'
                {...register('name')}
                className='bg-gray-100 border border-gray-600 text-gray-900 text-lg rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
              />
              {shouldCheckExists && (
                <div className='absolute -right-8 md:-right-10 top-1/2 transform -translate-y-1/2'>
                  {isChecking && (
                    <div className='h-6 w-6 animate-spin rounded-full border-4 border-solid border-t-transparent border-blue-600'></div>
                  )}
                  {name && !isChecking && !nameExists && <FaCheck color='green' size={20} />}
                  {name && !isChecking && nameExists && <FaTimes color='red' size={20} />}
                </div>
              )}
            </div>
            {errors.name && <p className='text-sm text-red-600'>{errors.name.message}</p>}
          </div>

          <div className='mb-4'>
            <label htmlFor='logo' className='block mb-2 text-lg font-medium text-gray-900'>
              Logo
            </label>
            <input
              type='file'
              id='logo'
              accept='image/png, image/jpeg'
              {...register('logo')}
              className='bg-gray-100 border border-gray-600 text-gray-900 text-lg rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
            />
            {errors.logo && <p className='text-sm text-red-600'>{errors.logo.message}</p>}

            {logoPreview && (
              <div className='mt-4'>
                <img src={logoPreview} alt='Logo Preview' className='w-32 h-32 object-contain' />
              </div>
            )}
          </div>

          <div className='mb-4'>
            <label htmlFor='categories' className='block mb-2 text-lg font-medium text-gray-900'>
              Danh mục
            </label>
            {isLoadingCats ? (
              <div className='flex items-center gap-5'>
                <select id='categories' disabled multiple className='w-50'>
                  <option value=''>Chọn danh mục</option>
                </select>
                <div className='h-6 w-6 animate-spin rounded-full border-4 border-solid border-t-transparent border-blue-600'></div>
              </div>
            ) : (
              <select
                id='categories'
                multiple
                onChange={(e) => {
                  const selectedCategory = categories.find((c) => c.id === Number(e.target.value))
                  if (selectedCategory) {
                    handleCategorySelect(selectedCategory.id, selectedCategory.name)
                  }
                }}
                className='bg-gray-100 border border-gray-600 text-gray-900 text-lg rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
              >
                <option value=''>Chọn danh mục</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            )}

            {errors.categoryIds && <p className='text-sm text-red-600'>{errors.categoryIds.message}</p>}

            {selectedCategories.length > 0 && (
              <ul className='flex flex-wrap gap-2 overflow-y-scroll mt-2 max-h-[100px]'>
                {selectedCategories.map((category) => (
                  <li key={category.id} className='bg-gray-200 rounded-lg p-2 flex items-center space-x-2'>
                    <span>{category.name}</span>
                    <button type='button' onClick={() => handleRemoveCategory(category.id)}>
                      <FaTimes className='text-red-600' />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className='flex items-center justify-center gap-3 mt-8'>
            {!isChanged || isLoadingCats || isProcessing || isChecking || nameExists ? (
              <button
                type='submit'
                disabled
                className='text-white bg-gray-400 focus:ring-4 focus:outline-non font-medium rounded-lg text-xl px-8 py-2 text-center'
              >
                {isProcessing ? 'Loading...' : 'Cập nhật'}
              </button>
            ) : (
              <button
                type='submit'
                className='text-white bg-green-500 focus:ring-4 focus:outline-non font-medium rounded-lg text-xl px-6 md:px-8 py-2 text-center'
              >
                Cập nhật
              </button>
            )}

            <button
              type='button'
              onClick={closeModal}
              className='text-white bg-gray-400 focus:ring-4 focus:outline-none font-medium rounded-lg text-xl px-6 md:px-8 py-2 text-center'
            >
              Huỷ
            </button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
export default EditBrand
