import Carousel from 'react-multi-carousel'
import { ProductImage } from '../../models/product/productImage.type'

type ProductCarouselProps = {
  productImages: ProductImage[]
  setShowImage: (imgUrl: string) => void
}

function ProductCarousel({ productImages, setShowImage }: ProductCarouselProps) {
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 5
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 4
    },
    mdtablet: {
      breakpoint: { max: 991, min: 464 },
      items: 4
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 3
    },
    smmobile: {
      breakpoint: { max: 640, min: 0 },
      items: 2
    },
    xsmobile: {
      breakpoint: { max: 440, min: 0 },
      items: 1
    }
  }
  return (
    <Carousel autoPlay={true} infinite={true} responsive={responsive} transitionDuration={500}>
      {productImages.map((image) => {
        return (
          <div key={image.id} onClick={() => setShowImage(image.url)}>
            <img className='h-[120px] cursor-pointer' src={image.url} alt='Product Image' />
          </div>
        )
      })}
    </Carousel>
  )
}
export default ProductCarousel
