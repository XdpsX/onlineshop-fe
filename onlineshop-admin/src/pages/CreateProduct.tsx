import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { FaSave, FaCheck, FaTimes, FaTrash } from 'react-icons/fa'
import { useAppDispatch, useAppSelector } from '~/store'
import { getBrandsByCategoryId, selectBrand } from '~/store/features/brandSlice'
import { getAllCategories, selectCategory } from '~/store/features/categorySlice'
import { useEffect, useState } from 'react'
import { slugify } from '~/utils/helper'
import debounce from 'lodash/debounce'
import { checkProductExists, createProduct, selectProduct } from '~/store/features/productSlice'
import { toast } from 'react-toastify'
import { ProductCreate } from '~/types/product'

const schema = yup.object().shape({
  name: yup.string().max(255).required('Vui lòng nhập tên'),
  slug: yup.string().max(255).required('Vui lòng nhập slug'),
  price: yup.number().min(0).max(1_000_000_000).required('Vui lòng nhập giá').typeError('Vui lòng nhập giá'),
  discountPercent: yup.number().min(0).max(100).typeError('Chỉ nhập số'),
  inStock: yup.bool(),
  published: yup.bool(),
  description: yup.string().max(4000, 'Mô tả tối đa 4000 kí tự'),
  categoryId: yup
    .number()
    .required('Vui lòng chọn danh mục')
    .typeError('Vui lòng chọn danh mục') // Thông báo lỗi khi không phải là số
    .positive('Category must be a positive number') // Thông báo lỗi khi không phải là số dương
    .integer('Category must be an integer'),
  brandId: yup.number().required('Vui lòng chọn thương hiệu').typeError('Vui lòng chọn thương hiệu'),
  images: yup.array().of(yup.mixed())
})

const CreateProduct = () => {
  const {
    control,
    handleSubmit,
    register,
    setValue,
    reset,
    watch,
    formState: { errors }
  } = useForm<ProductCreate>({
    // @ts-expect-error type not match schema
    resolver: yupResolver(schema),
    defaultValues: {
      price: 0,
      discountPercent: 0,
      inStock: true
    }
  })
  const categoryId = watch('categoryId')
  const name = watch('name')
  const slug = watch('slug')

  const dispatch = useAppDispatch()
  const { categories, isLoading: isLoadingCats, error: catsError } = useAppSelector(selectCategory)
  const { catBrands: brands, isLoading: isLoadingBrands, error: brandsError } = useAppSelector(selectBrand)
  const { isChecking, exists, error: createProductErr, isLoading: isCreatingProd } = useAppSelector(selectProduct)
  const [autoSlug, setAutoSlug] = useState(true)
  const [images, setImages] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [errorMessage, setErrorMessage] = useState<string>('')

  useEffect(() => {
    if (autoSlug && name) {
      const generatedSlug: string = slugify(name)
      if (generatedSlug !== slug) {
        setValue('slug', generatedSlug)
      }
    }
  }, [name, autoSlug, setValue, slug])

  useEffect(() => {
    const debouncedCheck = debounce(async (slug: string) => {
      if (slug) {
        dispatch(checkProductExists({ slug }))
      }
    }, 500)

    debouncedCheck(slug)
    return () => {
      debouncedCheck.cancel()
    }
  }, [slug, dispatch])

  useEffect(() => {
    dispatch(getAllCategories())
  }, [dispatch])

  useEffect(() => {
    if (categoryId) {
      dispatch(getBrandsByCategoryId(categoryId))
    }
  }, [dispatch, categoryId])

  useEffect(() => {
    if (catsError) {
      toast.error(catsError.message)
    }
    if (brandsError) {
      toast.error(brandsError.message)
    }
    if (createProductErr) {
      toast.error(createProductErr.message)
    }
  }, [catsError, brandsError, createProductErr])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    // Lọc các file có định dạng không hợp lệ (png, jpg)
    const validFiles = files.filter((file) => file.type === 'image/png' || file.type === 'image/jpeg')

    if (validFiles.length !== files.length) {
      setErrorMessage('Only PNG and JPG images are allowed.')
    } else {
      setErrorMessage('') // Xóa thông báo lỗi nếu tất cả định dạng hợp lệ
    }

    const totalImages = images.length + validFiles.length
    if (totalImages > 5) {
      setErrorMessage('You can only upload up to 5 images.')
      return // Không thêm ảnh mới nếu tổng số ảnh vượt quá 5
    }

    const newImages: File[] = [...images] // Khởi tạo mảng mới từ images hiện tại
    const newPreviews: string[] = [...previewUrls] // Mảng để lưu trữ các URL preview
    let validImageCount = 0 // Biến đếm số ảnh hợp lệ

    // Kiểm tra kích thước ảnh
    validFiles.forEach((file) => {
      const img = new Image()
      const objectUrl = URL.createObjectURL(file)

      img.onload = () => {
        if (img.width >= 300) {
          // Nếu width >= 300px, thêm ảnh vào danh sách
          newImages.push(file) // Thêm file vào mảng mới
          newPreviews.push(objectUrl) // Thêm URL vào mảng preview
          validImageCount++ // Tăng số ảnh hợp lệ
        } else {
          setErrorMessage('Each image must have a width of at least 300px.')
          URL.revokeObjectURL(objectUrl) // Giải phóng bộ nhớ sau khi kiểm tra ảnh
        }

        // Cập nhật state chỉ khi tất cả ảnh đã được xử lý
        if (validImageCount === validFiles.length) {
          if (newImages.length > 5) {
            newImages.splice(5) // Giữ tối đa 5 ảnh
          }
          setImages(newImages)
          setPreviewUrls(newPreviews)
        }
      }

      img.onerror = () => {
        setErrorMessage('An error occurred while loading the image.')
        URL.revokeObjectURL(objectUrl) // Giải phóng bộ nhớ nếu có lỗi
      }

      img.src = objectUrl // Bắt đầu tải ảnh để kiểm tra kích thước
    })
  }

  const removeImage = (index: number) => {
    // Giải phóng URL của ảnh bị xóa
    const objectUrlToRevoke = previewUrls[index]
    URL.revokeObjectURL(objectUrlToRevoke)

    const newImages = images.filter((_, i) => i !== index)
    setImages(newImages)

    const newPreviews = newImages.map((image) => URL.createObjectURL(image))
    setPreviewUrls(newPreviews)
  }

  const onSubmit = (data: ProductCreate) => {
    data.images = images
    console.log(data)
    // Xử lý dữ liệu ở đây
    dispatch(createProduct(data))
      .unwrap()
      .then(() => {
        previewUrls.forEach((url) => URL.revokeObjectURL(url))
        // window.location.reload()
        toast.success('Thêm sản phẩm thành công')
        reset()
        setImages([])
        setPreviewUrls([])
      })
  }

  return (
    <div className='px-10 py-8 bg-white shadow-md'>
      <h1 className='text-3xl font-bold mb-8 text-center text-gray-800'>Tạo sản phẩm</h1>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-5 max-w-[768px] mx-auto'>
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-5 md:gap-10'>
          <div className='flex-1'>
            <label className='block mb-1 font-medium'>Tên*:</label>
            <input
              {...register('name')}
              className='text-black text-xl border border-slate-600 rounded-md px-2 w-full '
            />
            {errors.name && <p className='text-red-500'>{errors.name.message}</p>}
          </div>
          <div className='flex-1'>
            <label className='block mb-1 font-medium'>Slug*:</label>
            <div className='relative w-full '>
              <input
                {...register('slug')}
                onChange={(e) => {
                  setAutoSlug(false)
                  setValue('slug', e.target.value)
                }}
                className='text-black text-xl border border-slate-600 rounded-md w-full ps-2 md:pe-8'
              />
              <div className='absolute -right-8 md:-right-10 top-1/2 transform -translate-y-1/2'>
                {isChecking && (
                  <div className='h-6 w-6 animate-spin rounded-full border-4 border-solid border-t-transparent border-blue-600'></div>
                )}
                {slug && !isChecking && !exists.slugExists && <FaCheck color='green' size={20} />}
                {slug && !isChecking && exists.slugExists && <FaTimes color='red' size={20} />}
              </div>
            </div>

            {errors.slug && <p className='text-red-500'>{errors.slug.message}</p>}
          </div>
        </div>
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-5 md:gap-10'>
          <div className='flex-1'>
            <label className='block mb-1 font-medium'>Giá*:</label>
            <input
              type='number'
              {...register('price')}
              className='text-black text-xl border border-slate-600 rounded-md px-2 w-full md:w-1/2'
              step='.01'
              min='0'
            />
            {errors.price && <p className='text-red-500'>{errors.price.message}</p>}
          </div>
          <div className='flex-1'>
            <label className='block mb-1 font-medium'>% Giảm giá (0-100):</label>
            <input
              type='number'
              {...register('discountPercent')}
              className='text-black text-xl border border-slate-600 rounded-md px-2 w-full md:w-1/2'
              step='.1'
              min='0'
            />
            {errors.discountPercent && <p className='text-red-500'>{errors.discountPercent.message}</p>}
          </div>
        </div>
        <div className='flex items-center gap-4 md:gap-5'>
          <div className='flex items-center gap-2 md:gap-4 my-6'>
            <input type='checkbox' {...register('inStock')} className='w-4 h-4' />
            <label>Còn hàng</label>
          </div>
          <div className='flex items-center gap-2 md:gap-4 my-6'>
            <input type='checkbox' {...register('published')} className='w-4 h-4' />
            <label>Công khai</label>
          </div>
        </div>
        <div>
          <label className='block mb-2 font-medium'>Mô tả</label>
          <div className='ckeditor-container'>
            <Controller
              name='description'
              control={control}
              render={({ field }) => (
                <CKEditor
                  editor={ClassicEditor}
                  data={field.value || ''}
                  onChange={(_event, editor) => {
                    const data = editor.getData()
                    field.onChange(data)
                  }}
                />
              )}
            />
          </div>

          {errors.description && <p className='text-red-500'>{errors.description.message}</p>}
        </div>
        <div className='flex flex-col gap-1'>
          <label htmlFor='categories' className='mb-1 font-medium'>
            Danh mục*
          </label>
          {isLoadingCats ? (
            <div className='relative w-full md:w-1/3'>
              <select id='categories' disabled className='p-1 md:px-3 md:py-2 rounded-md w-full'>
                <option value=''>--Chọn danh mục--</option>
              </select>
              <div className='absolute top-1/2 right-1/2 -translate-y-1/2'>
                <div className='h-4 w-4 md:h-6 md:w-6 animate-spin rounded-full border-4 border-solid border-t-transparent border-blue-600'></div>
              </div>
            </div>
          ) : (
            <select
              id='categories'
              {...register('categoryId')}
              className='w-full md:w-1/3 p-1 md:px-3 md:py-2 rounded-md border border-slate-600'
            >
              <option value='' disabled>
                --Chọn danh mục--
              </option>
              {categories?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          )}
          {errors.categoryId && <p className='text-red-500'>{errors.categoryId.message}</p>}
        </div>
        <div className='flex flex-col gap-1'>
          <label htmlFor='brands' className='mb-1 font-semibold'>
            Thương hiệu*
          </label>
          {isLoadingBrands ? (
            <div className='relative w-full md:w-1/3'>
              <select id='brands' disabled className='p-1 md:px-3 md:py-2 rounded-md w-full'>
                <option value=''>--Chọn thương hiệu--</option>
              </select>
              <div className='absolute top-1/2 right-1/2 -translate-y-1/2'>
                <div className='h-4 w-4 md:h-6 md:w-6 animate-spin rounded-full border-4 border-solid border-t-transparent border-blue-600'></div>
              </div>
            </div>
          ) : (
            <select
              id='brands'
              {...register('brandId')}
              disabled={!categoryId || brands === null}
              className='w-full md:w-1/3 p-1 md:px-3 md:py-2 rounded-md border border-slate-600'
            >
              <option value='' disabled>
                --Chọn thương hiệu--
              </option>
              {categoryId &&
                brands?.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
            </select>
          )}
          {errors.brandId && <p className='text-red-500'>{errors.brandId.message}</p>}
        </div>
        <div>
          <label className='block mb-1 font-medium'>Ảnh (Tối đa 5)</label>
          {/* Hiển thị preview của các ảnh */}
          <div className='flex flex-wrap gap-4 mt-3'>
            {previewUrls.map((url, index) => (
              <div key={index} className='relative'>
                <img src={url} alt={`preview-${index}`} className='w-24 h-24 object-cover' />
                <button
                  type='button'
                  className='absolute top-1 right-1 text-red-500'
                  onClick={() => removeImage(index)}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
            {images.length < 5 && (
              <label className='flex items-center justify-center w-24 h-24 bg-gray-200 cursor-pointer relative'>
                <img src='/default-image.png' alt='Add Image' className='w-full h-full object-cover' />
                <input
                  type='file'
                  accept='image/png, image/jpeg'
                  multiple
                  className='hidden'
                  onChange={handleImageUpload}
                />
              </label>
            )}
          </div>
          {/* Thông báo lỗi nếu có */}
          {errorMessage && <p className='text-red-500 text-sm mt-2'>{errorMessage}</p>}
        </div>
        {(name && (isChecking || exists.slugExists)) || isCreatingProd ? (
          <button type='submit' disabled className='bg-gray-500 text-white p-2 rounded flex items-center'>
            <FaSave className='mr-2' /> {isCreatingProd ? 'Loading...' : 'Thêm sản phẩm'}
          </button>
        ) : (
          <button type='submit' className='bg-blue-500 text-white p-2 rounded flex items-center'>
            <FaSave className='mr-2' /> Thêm sản phẩm
          </button>
        )}
      </form>
    </div>
  )
}

export default CreateProduct
