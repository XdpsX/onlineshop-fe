import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useAppDispatch, useAppSelector } from '~/store'
import { getBrandsByCategoryId, resetCatBrands, selectBrand } from '~/store/features/brandSlice'
import { getAllCategories, selectCategory } from '~/store/features/categorySlice'
import { DEFAULT_SORT, sortOptions } from '~/utils/data'
import { fromStringToBoolean } from '~/utils/helper'
import { FaAngleUp, FaAngleDown } from 'react-icons/fa'
import { resetProductParams, selectProduct, updateProductParams } from '~/store/features/productSlice'
import { ProductParams } from '~/types/product'

const ProductFilter = () => {
  const dispatch = useAppDispatch()
  const { categories, isLoading: isLoadingCats, error: catsError } = useAppSelector(selectCategory)
  const { catBrands: brands, isLoading: isLoadingBrands, error: brandsError } = useAppSelector(selectBrand)
  const { params } = useAppSelector(selectProduct)

  const [open, setOpen] = useState<boolean>(true)
  const [search, setSearch] = useState<string | null>(params.search)
  const [minPrice, setMinPrice] = useState<number | null>(params.minPrice)
  const [maxPrice, setMaxPrice] = useState<number | null>(params.maxPrice)
  const [isPublic, setIsPublic] = useState<boolean | null>(params.hasPublished)
  const [isDiscount, setIsDiscount] = useState<boolean | null>(params.hasDiscount)
  const [isInStock, setIsInStock] = useState<boolean | null>(params.inStock)
  const [categoryId, setCategoryId] = useState<number | null>(params.categoryId)
  const [brandId, setBrandId] = useState<number | null>(params.brandId)
  const [sort, setSort] = useState<string>(params.sort)

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
  }, [catsError, brandsError])

  useEffect(() => {
    const handleResize = () => {
      if (window.matchMedia('(min-width: 768px)').matches) {
        setOpen(true)
      } else {
        setOpen(false)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const setPrice = (e: ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value) {
      const value = e.target.value
      if (value === '0') {
        setMaxPrice(10_000_000)
      } else if (value === '1') {
        setMinPrice(10_000_000)
        setMaxPrice(20_000_000)
      } else {
        setMinPrice(20_000_000)
      }
    } else {
      setMinPrice(null)
      setMaxPrice(null)
    }
  }
  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    console.log(search)
    const newParams: ProductParams = {
      pageNum: 1,
      search: search,
      sort: sort,
      minPrice: minPrice,
      maxPrice: maxPrice,
      hasPublished: isPublic,
      hasDiscount: isDiscount,
      inStock: isInStock,
      categoryId: categoryId,
      brandId: brandId
    }
    dispatch(updateProductParams(newParams))
  }

  const onReset = () => {
    dispatch(resetProductParams())
    dispatch(resetCatBrands())
    setSearch(null)
    setSort(DEFAULT_SORT)
    setCategoryId(null)
  }

  return (
    <div className='bg-blue-300 text-slate-600 shadow-md mb-8 py-6 px-10  rounded-md'>
      <div className='md:hidden flex justify-between text-black '>
        <h3 className='text-2xl font-bold'>Lọc sản phẩm</h3>
        <button onClick={() => setOpen(!open)} className='text-2xl'>
          {open ? <FaAngleUp /> : <FaAngleDown />}
        </button>
      </div>
      {open && (
        <form onSubmit={onSubmit} onReset={onReset} className='flex flex-col gap-5 mt-4'>
          <div className='flex items-center flex-wrap gap-x-10 gap-y-3'>
            <div className='flex flex-col gap-1'>
              <label htmlFor='search' className='text-lg font-semibold'>
                Tìm kiếm
              </label>
              <input
                id='search'
                className='p-1 md:px-3 md:py-2 border border-slate-400 rounded-md focus:border-indigo-500 outline-none text-black'
                type='text'
                placeholder='Tên sản phẩm...'
                onChange={(e) => setSearch(e.target.value)}
                value={search || ''}
              />
            </div>
            <div className='flex flex-col gap-1'>
              <label htmlFor='price' className='text-lg font-semibold'>
                Giá
              </label>
              <select id='price' className='p-1 md:px-3 md:py-2 rounded-md' onChange={setPrice}>
                <option value=''>--Giá--</option>
                <option value='0'>Dưới 10 triệu</option>
                <option value='1'>10 - 20 triệu</option>
                <option value='2'>Trên 20 triệu</option>
              </select>
            </div>
            <div className='flex flex-col gap-1'>
              <label htmlFor='public' className='text-lg font-semibold'>
                Công khai
              </label>
              <select
                id='public'
                className='p-1 md:px-3 md:py-2 rounded-md'
                onChange={(e) => setIsPublic(fromStringToBoolean(e.target.value))}
              >
                <option value=''>--Công khai--</option>
                <option value='0'>Không</option>
                <option value='1'>Có</option>
              </select>
            </div>
            <div className='flex flex-col gap-1'>
              <label htmlFor='discount' className='text-lg font-semibold'>
                Giảm giá
              </label>
              <select
                id='discount'
                className='p-1 md:px-3 md:py-2 rounded-md'
                onChange={(e) => setIsDiscount(fromStringToBoolean(e.target.value))}
              >
                <option value=''>--Giảm giá--</option>
                <option value='0'>Không</option>
                <option value='1'>Có</option>
              </select>
            </div>
            <div className='flex flex-col gap-1'>
              <label htmlFor='inStock' className='text-lg font-semibold'>
                Còn hàng
              </label>
              <select
                id='inStock'
                className='p-1 md:px-3 md:py-2 rounded-md'
                onChange={(e) => setIsInStock(fromStringToBoolean(e.target.value))}
              >
                <option value=''>--Còn hàng--</option>
                <option value='0'>Không</option>
                <option value='1'>Có</option>
              </select>
            </div>
            <div className='flex flex-col gap-1'>
              <label htmlFor='categories' className='text-lg font-semibold'>
                Danh mục
              </label>
              {isLoadingCats ? (
                <div className='relative'>
                  <select id='categories' disabled className='p-1 md:px-3 md:py-2 rounded-md'>
                    <option value=''>--Chọn danh mục--</option>
                  </select>
                  <div className='absolute top-1/2 right-1/2 -translate-y-1/2'>
                    <div className='h-4 w-4 md:h-6 md:w-6 animate-spin rounded-full border-4 border-solid border-t-transparent border-blue-600'></div>
                  </div>
                </div>
              ) : (
                <select
                  id='categories'
                  onChange={(e) => {
                    if (e.target.value) {
                      setCategoryId(Number(e.target.value))
                      return
                    }
                    setCategoryId(null)
                  }}
                  className='p-1 md:px-3 md:py-2 rounded-md'
                >
                  <option value=''>--Chọn danh mục--</option>
                  {categories?.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className='flex flex-col gap-1'>
              <label htmlFor='brands' className='text-lg font-semibold'>
                Thương hiệu
              </label>
              {isLoadingBrands ? (
                <div className='relative'>
                  <select id='brands' disabled className='p-1 md:px-3 md:py-2 rounded-md'>
                    <option value=''>--Chọn thương hiệu--</option>
                  </select>
                  <div className='absolute top-1/2 right-1/2 -translate-y-1/2'>
                    <div className='h-4 w-4 md:h-6 md:w-6 animate-spin rounded-full border-4 border-solid border-t-transparent border-blue-600'></div>
                  </div>
                </div>
              ) : (
                <select
                  id='brands'
                  disabled={!categoryId || brands === null}
                  onChange={(e) => {
                    if (e.target.value) {
                      setBrandId(Number(e.target.value))
                      return
                    }
                    setBrandId(null)
                  }}
                  className='p-1 md:px-3 md:py-2 rounded-md'
                >
                  <option value=''>--Chọn thương hiệu--</option>
                  {categoryId &&
                    brands?.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                </select>
              )}
            </div>
            <div className='flex flex-col gap-1'>
              <label htmlFor='price' className='text-lg font-semibold'>
                Sắp xếp
              </label>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className='p-1 md:px-3 md:py-2 rounded-md'>
                {sortOptions.map((option) => (
                  <option key={option.id} value={option.value}>
                    {option.title}
                  </option>
                ))}
                <option value='price'>Giá: tăng dần</option>
                <option value='-price'>Giá: giảm dần</option>
              </select>
            </div>
          </div>
          <div className='flex gap-3'>
            <button type='submit' className='bg-yellow-500 text-gray-100 px-4 py-2 text-lg rounded-md'>
              Phân loại
            </button>
            <button type='reset' className='bg-red-500 text-gray-100 px-4 py-2 text-lg rounded-md'>
              Xoá
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
export default ProductFilter
