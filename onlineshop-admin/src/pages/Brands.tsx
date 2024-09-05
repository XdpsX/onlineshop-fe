import { BrandContainer, BrandFilter } from '~/components/brand'

const Brands = () => {
  return (
    <div className='px-2 lg:px-7 pt-5'>
      <BrandFilter />
      <BrandContainer />
    </div>
  )
}
export default Brands
