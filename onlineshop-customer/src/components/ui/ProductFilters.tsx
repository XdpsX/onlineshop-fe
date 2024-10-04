import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { Brand } from '../../models/brand/brand.type'
import api from '../../services/api'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import {
  resetFilters,
  selectProduct,
  setBrandIds,
  setPrices as setFilterPrices
} from '../../features/products/productSlice'
import { Range } from 'react-range'
import { formatPrice } from '../../utils/helper'

const INIT_MIN_PRICE = 0
const INIT_MAX_PRICE = 200_000_000
function ProductFilters({ categoryId }: { categoryId: number }) {
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const dispatch = useAppDispatch()
  const { minPrice, maxPrice } = useAppSelector(selectProduct)
  const { brandIds } = useAppSelector(selectProduct)
  const [isOpen, setIsOpen] = useState(true)
  const [prices, setPrices] = useState([minPrice || INIT_MIN_PRICE, maxPrice || INIT_MAX_PRICE])

  const {
    isError,
    error,
    data: brands
  } = useQuery({
    queryKey: ['fetchBrandsByCategoryId', categoryId],
    queryFn: async (): Promise<Brand[]> => {
      const res = await api.get(`/categories/${categoryId}/brands`)
      return res.data
    },
    retry: 2
  })

  const handleResize = () => {
    if (window.innerWidth > 768) {
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }
  }
  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    dispatch(setFilterPrices(prices))
  }, [dispatch, prices])

  if (isError) {
    console.error(error)
    return null
  }

  return (
    <>
      <div className={` md:hidden block `}>
        <button onClick={() => setIsOpen(!isOpen)} className='text-center w-full py-2 px-3 bg-indigo-500 text-white'>
          Lọc sản phẩm
        </button>
      </div>
      <div className='py-4'>
        <div
          ref={dropdownRef}
          style={{ height: isOpen ? `${dropdownRef.current && dropdownRef.current.scrollHeight}px` : '0px' }}
          className='overflow-hidden transition-all duration-500 space-y-6'
        >
          {brands?.length !== 0 && (
            <div>
              <h2 className='text-2xl font-bold text-slate-600'>Thương hiệu</h2>
              <div className='py-2'>
                {brands?.map((brand) => (
                  <div className='flex justify-start items-center gap-2 py-1' key={brand.id}>
                    <input
                      type='checkbox'
                      id={`${brand.id}`}
                      checked={brandIds?.includes(brand.id) || false}
                      onChange={(e) => {
                        if (e.target.checked) {
                          const newBrandIds = brandIds ? [...brandIds, brand.id] : [brand.id]
                          dispatch(setBrandIds(newBrandIds))
                        } else {
                          const newBrandIds = brandIds?.filter((id) => id !== brand.id)
                          dispatch(setBrandIds(newBrandIds))
                        }
                      }}
                    />
                    <label className='text-slate-600 block cursor-pointer' htmlFor={`${brand.id}`}>
                      {brand.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className='py-2 flex flex-col gap-5'>
            <h2 className='text-2xl font-bold text-slate-600'>Giá</h2>
            <div className='pl-2 pr-20'>
              <Range
                step={10_000_000}
                min={0}
                max={200_000_000}
                values={prices}
                onChange={(values) => setPrices(values)}
                renderTrack={({ props, children }) => (
                  <div {...props} className='w-full h-[6px] bg-slate-200 rounded-full cursor-pointer'>
                    {children}
                  </div>
                )}
                renderThumb={({ props }) => {
                  const { key, ...restProps } = props // Destructure to remove key
                  return <div key={key} className='w-[15px] h-[15px] bg-blue-500 rounded-full' {...restProps} />
                }}
              />
              <div>
                <span className='text-slate-800 font-bold text-lg'>
                  {formatPrice(Math.floor(prices[0]))} - {formatPrice(Math.floor(prices[1]))}
                </span>
              </div>
            </div>
          </div>

          <div>
            <button
              onClick={() => {
                dispatch(resetFilters())
                setPrices([INIT_MIN_PRICE, INIT_MAX_PRICE])
              }}
              className='bg-red-500 text-white px-6 py-2 font-semibold rounded-sm hover:bg-red-600'
            >
              Xoá lọc
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
export default ProductFilters
