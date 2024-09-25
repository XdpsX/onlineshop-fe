import Banner from '../components/ui/Banner'
import CategoryDropdown from '../components/ui/CategoryDropdown'
import DiscountProducts from '../components/ui/DiscountProducts'
import LatestProducts from '../components/ui/LatestProducts'

function Home() {
  return (
    <div className='bg-white space-y-10 mb-20'>
      {/* BANNER & CATEGORIES */}
      <div className='flex flex-wrap'>
        <div className='w-full md:w-1/5'>
          <CategoryDropdown />
        </div>
        <div className='w-full md:w-4/5'>
          <Banner />
        </div>
      </div>
      {/* Products */}
      <div className='px-4 space-y-5'>
        <DiscountProducts />
        <LatestProducts />
      </div>
    </div>
  )
}

export default Home
