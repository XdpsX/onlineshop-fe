import { useQuery } from '@tanstack/react-query'
import { Product } from '../../models/product/product.type'
import api from '../../services/api'
import Loading from './Loading'
import ProductList from '../shared/ProductList'
import Heading from '../shared/Heading'

function LatestProducts() {
  const {
    isLoading,
    isError,
    data: products
  } = useQuery({
    queryKey: ['fetchLatestProducts'],
    queryFn: async (): Promise<Product[]> => {
      const res = await api.get('/products/latest')
      return res.data.items
    }
  })

  if (isLoading) {
    return (
      <div className='w-[85%] flex flex-wrap mx-auto'>
        <Heading>Sản phẩm mới nhất</Heading>
        <div className='mx-auto pb-24'>
          <Loading size='large' />
        </div>
      </div>
    )
  }

  if (isError) {
    return
  }

  return (
    <div className='flex flex-wrap mx-auto'>
      <Heading>Sản phẩm mới nhất</Heading>
      <ProductList products={products} />
    </div>
  )
}
export default LatestProducts
