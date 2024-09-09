import { ProductContainer, ProductFilter } from '~/components/product'

const Products = () => {
  return (
    <div className='px-2 lg:px-7 pt-5'>
      <ProductFilter />
      <ProductContainer />
    </div>
  )
}
export default Products
