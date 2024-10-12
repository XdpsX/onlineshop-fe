import { useEffect } from 'react'
import { Loader, Modal, Tabs } from '../common'
import { useAppDispatch, useAppSelector } from '~/store'
import { getProductById, selectProduct, setDetailId } from '~/store/features/productSlice'
import { formatPrice } from '~/utils/helper'

const ProductDetailsModal = () => {
  const dispatch = useAppDispatch()
  const {
    detailId,
    productDetail,
    loading: { getProductById: isLoading }
  } = useAppSelector(selectProduct)
  const isOpen = !!detailId

  useEffect(() => {
    if (detailId) {
      dispatch(getProductById(detailId))
    }
  }, [dispatch, detailId])

  const onClose = () => dispatch(setDetailId(null))

  if (isLoading) {
    return (
      <Modal isOpen={isOpen} onClose={() => dispatch(setDetailId(null))}>
        <Loader />
      </Modal>
    )
  }
  if (!productDetail) return

  const tabs = [
    {
      label: 'Thông tin cơ bản',
      content: (
        <div className='flex flex-col gap-5'>
          <div className='grid md:grid-cols-4'>
            <h4 className='col-span-1'>Tên:</h4>
            <p className='col-span-3 border bg-gray-200 px-3 py-1 rounded'>{productDetail.name}</p>
          </div>
          <div className='grid md:grid-cols-4'>
            <h4 className='col-span-1'>Giá:</h4>
            <p className='col-span-3 border bg-gray-200 px-3 py-1 rounded'>{formatPrice(productDetail.price)}</p>
          </div>
          <div className='grid md:grid-cols-4'>
            <h4 className='col-span-1'>Giảm giá:</h4>
            <p className='col-span-3 border bg-gray-200 px-3 py-1 rounded'>{productDetail.discountPercent}%</p>
          </div>
          <div className='grid md:grid-cols-4'>
            <h4 className='col-span-1'>Tình trạng:</h4>
            <p className='col-span-3 border bg-gray-200 px-3 py-1 rounded'>
              {productDetail.inStock ? 'Còn hàng' : 'Hết hàng'}
            </p>
          </div>
          <div className='grid md:grid-cols-4'>
            <h4 className='col-span-1'>Công khai:</h4>
            <p className='col-span-3 border bg-gray-200 px-3 py-1 rounded'>{productDetail.inStock ? 'Có' : 'Không'}</p>
          </div>
          <div className='grid md:grid-cols-4'>
            <h4 className='col-span-1'>Danh mục:</h4>
            <p className='col-span-3 border bg-gray-200 px-3 py-1 rounded'>{productDetail.category.name}</p>
          </div>
          <div className='grid md:grid-cols-4'>
            <h4 className='col-span-1'>Thương hiệu:</h4>
            <p className='col-span-3 border bg-gray-200 px-3 py-1 rounded'>{productDetail.brand.name}</p>
          </div>
        </div>
      )
    },
    {
      label: 'Mô tả',
      content: <div dangerouslySetInnerHTML={{ __html: productDetail.description }} />
    },
    {
      label: 'Hình ảnh',
      content: (
        <div className='grid grid-cols-3 gap-4'>
          {productDetail.images.map((image) => (
            <img key={image.id} src={image.url} alt={productDetail.name} className='w-54 h-auto' />
          ))}
        </div>
      )
    }
  ]
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className='md:min-w-[620px] min-w-[310px] max-w-[680px]'>
        <h1 className='font-bold text-2xl mb-2'>Chi tiết sản phẩm</h1>
        <Tabs tabs={tabs} />
        <div className='mt-5 border-t pt-2 px-6 text-right'>
          <button onClick={onClose} className=' bg-red-500 text-white p-2 rounded '>
            Đóng
          </button>
        </div>
      </div>
    </Modal>
  )
}
export default ProductDetailsModal
