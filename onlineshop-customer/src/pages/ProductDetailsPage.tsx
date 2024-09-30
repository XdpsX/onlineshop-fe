import { json, useParams } from 'react-router-dom'
import { ProductDetails } from '../models/product/productDetails.type'
import api from '../services/api'
import { useQuery } from '@tanstack/react-query'
import Loading from '../components/ui/Loading'
import { Error as ErrorDTO } from '../models/error.type'
import { useState } from 'react'
import ProductCarousel from '../components/ui/ProductCarousel'
import { formatPrice } from '../utils/helper'

function ProductDetailsPage() {
  const { slug } = useParams()
  const [showImage, setShowImage] = useState('')
  const [quantity, setQuantity] = useState(1)

  const {
    isLoading,
    isError,
    error,
    data: product
  } = useQuery({
    queryKey: ['fetchProductDetails', slug],
    queryFn: async (): Promise<ProductDetails> => {
      const res = await api.get(`/products/slug/${slug}`)
      return res.data
    },
    retry: 2
  })

  const inc = () => {
    setQuantity(quantity + 1)
  }

  const dec = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  if (isLoading) {
    return (
      <div className='h-screen'>
        <Loading size='large' />
      </div>
    )
  }
  if (isError || !product) {
    const err = error as unknown as ErrorDTO
    throw json(err.message, { status: err.status })
  }

  return (
    <section className='lg:w-[65%] md:w-[80%] w-[90%] h-full mx-auto py-16'>
      <div className='grid md:grid-cols-2 grid-cols-1 gap-12 border-b border-slate-800'>
        <div>
          <div className='p-5 border'>
            <img
              className='w-[320px] mx-auto'
              src={showImage ? showImage : product.images[0].url}
              alt='Product image'
            />
          </div>
          <div className='py-3'>
            {product.images && <ProductCarousel productImages={product.images} setShowImage={setShowImage} />}
          </div>
        </div>

        <div className='py-6'>
          <div className='flex flex-col gap-4 pb-6 border-b mb-10'>
            <div className='space-y-2'>
              <h3 className='text-2xl text-gray-800 font-bold'>{product.name} </h3>
            </div>
            <div className='flex gap-2'>
              <div className='w-[150px] text-gray-600 font-semibold flex flex-col gap-2'>
                <span>Thương hiệu:</span>
                <span>Tình trạng:</span>
              </div>
              <div className='flex flex-col gap-2 font-bold'>
                <span>{product.brand.name}</span>
                <span className={`text-${product.inStock ? 'green' : 'red'}-500`}>
                  {product.inStock ? `Còn hàng` : 'Hết hàng'}
                </span>
              </div>
            </div>

            {product.inStock && (
              <div className='font-bold flex gap-3'>
                {product.discountPercent !== 0 ? (
                  <div className='flex items-center gap-3'>
                    Giá: <h2 className='line-through text-gray-400'>{formatPrice(product.price)}</h2>
                    <h2 className='text-xl text-red-500 flex'>
                      {formatPrice(product.discountedPrice)}
                      <span className='ms-1.5 text-sm'>(-{product.discountPercent}%)</span>
                    </h2>
                  </div>
                ) : (
                  <h2>
                    Giá: <span className='text-xl text-gray-700'>{formatPrice(product.price)}</span>{' '}
                  </h2>
                )}
              </div>
            )}
          </div>

          {product.inStock && (
            <div className='space-y-4'>
              <div className='flex items-center text-xl'>
                <button onClick={dec} className='px-4 cursor-pointer border border-slate-300'>
                  -
                </button>
                <input
                  className='border w-1/6 text-center border-black'
                  value={quantity}
                  onChange={(e) => setQuantity(+e.target.value)}
                />
                <button onClick={inc} className='px-4 cursor-pointer border border-slate-300'>
                  +
                </button>
              </div>
              <div className='flex items-center gap-2'>
                <button
                  // onClick={add_card}
                  className='px-6 py-2 capitalize cursor-pointer hover:shadow-lg hover:shadow-blue-500/40 bg-blue-500 text-white'
                >
                  Thêm vào giỏ
                </button>
                <button
                  // onClick={buynow}
                  className='px-6 py-2 capitalize cursor-pointer hover:shadow-lg hover:shadow-red-500/40 bg-red-500 text-white'
                >
                  Mua ngay
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className='py-4'>
        <h3 className='text-2xl font-semibold text-gray-800 mb-2'>Mô tả sản phẩm</h3>
        <div dangerouslySetInnerHTML={{ __html: product.description }} />
      </div>
    </section>
  )
}
export default ProductDetailsPage
