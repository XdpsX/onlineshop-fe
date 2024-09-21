import Banner from '../components/ui/Banner'
import CategoryDropdown from '../components/ui/CategoryDropdown'

function Home() {
  return (
    <div>
      {/* BANNER & CATEGORIES */}
      <div className='bg-white flex flex-wrap'>
        <div className='w-full md:w-1/5'>
          <CategoryDropdown />
        </div>
        <div className='w-full md:w-4/5'>
          <Banner />
        </div>
      </div>
    </div>
  )
}

export default Home
