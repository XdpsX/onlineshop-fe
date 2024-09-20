import { Link, useRouteError } from 'react-router-dom'

function Error() {
  const error = useRouteError()
  // @ts-expect-error error is unknown
  if (error.status === 404) {
    return (
      <div className='text-center mt-28'>
        <p className='text-8xl  text-blue-950'>404</p>
        <h3 className='text-4xl text-gray-900 font-bold mb-2'>Không tìm thấy trang</h3>
        <p className='text-xl mb-8 text-gray-800'>
          Trang bạn đang tìm kiếm có thể đã bị xóa, chuyển đi, thay đổi link hoặc chưa bao giờ tồn tại.
        </p>
        <Link
          to='/'
          className='bg-blue-600 uppercase text-white text-lg p-4 rounded-md shadow-sm transition-colors hover:bg-blue-700'
        >
          Trở về Trang chủ
        </Link>
      </div>
    )
  }
  return (
    <div className='text-center mt-28'>
      <p className='text-8xl  text-blue-950'>500</p>
      <h3 className='text-4xl text-gray-900 font-bold mb-2'>Có lỗi xảy ra</h3>
      <p className='text-xl mb-8 text-gray-800'>Vui lòng thử lại sau</p>
    </div>
  )
}
export default Error
