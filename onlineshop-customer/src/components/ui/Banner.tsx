import Carousel from 'react-multi-carousel'
import { Link } from 'react-router-dom'

function Banner() {
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 1
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  }
  return (
    <div className='w-full flex flex-wrap md:gap-8 '>
      <div className='w-full '>
        <Carousel autoPlay={true} infinite={true} arrows={false} showDots={true} responsive={responsive}>
          {[1, 2, 3].map((i) => (
            <Link key={i} to='#'>
              <img src={`./banners/${i}.jpg`} alt='' />
            </Link>
          ))}
        </Carousel>
      </div>
    </div>
  )
}
export default Banner
