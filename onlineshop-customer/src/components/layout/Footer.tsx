import { Link } from 'react-router-dom'
import { FaFacebookF, FaTwitter, FaLinkedin, FaGithub, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className='bg-slate-200'>
      <div className='w-[85%] flex justify-between gap-6 md:gap-0 flex-wrap mx-auto border-b py-12 sm:pb-6'>
        <div className='flex flex-col gap-3'>
          <img src='./logo.png' alt='Logo' className='w-16' />
          <ul className='flex flex-col font-semibold gap-2 text-slate-600 text-sm'>
            <li className='flex items-center gap-2 '>
              <FaMapMarkerAlt />

              <span> 123 Đường ABC, XYZ, MNO</span>
            </li>
            <li className='flex items-center gap-2 '>
              <FaPhoneAlt />
              <span> 0123456789</span>
            </li>
            <li className='flex items-center gap-2 '>
              <FaEnvelope />
              <span> support@xdpsx.com</span>
            </li>
          </ul>
        </div>

        <div className='flex justify-center sm:justify-start'>
          <div>
            <div className='flex justify-between gap-10 md:gap-20'>
              <div>
                <h2 className='font-bold text-lg mb-2'>Thông tin</h2>
                <ul className='flex flex-col gap-2 text-slate-600 text-sm font-semibold'>
                  <li>
                    <Link to='#'>Giới thiệu</Link>
                  </li>
                  <li>
                    <Link to='#'>Tài khoản ngân hàng</Link>
                  </li>
                  <li>
                    <Link to='#'>Delivery Information </Link>
                  </li>
                  <li>
                    <Link to='#'>Tuyển dụng</Link>
                  </li>
                  <li>
                    <Link to='#'>Blogs</Link>
                  </li>
                </ul>
              </div>

              <div>
                <h2 className='font-bold text-lg mb-2'>Chính sách</h2>
                <ul className='flex flex-col gap-2 text-slate-600 text-sm font-semibold'>
                  <li>
                    <Link to='#'>Chính sách bảo mật</Link>
                  </li>
                  <li>
                    <Link to='#'>Bảo Mật Thanh Toán</Link>
                  </li>
                  <li>
                    <Link to='#'>Qui định bảo hành</Link>
                  </li>
                  <li>
                    <Link to='#'>Chính sách đổi trả</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className='flex flex-col justify-start gap-4 w-[480px]'>
          <div>
            <h2 className='font-bold text-lg'>Cập nhật mới nhất</h2>
            <p>Nhận email thông báo khi ra sản phẩm mới</p>
          </div>
          <div className='h-[50px] w-full bg-white border relative'>
            <input className='h-full bg-transparent w-full px-3 outline-0' type='text' placeholder='Nhập email' />
            <button className='h-full absolute right-0 bg-yellow-500 text-white uppercase px-4 font-bold text-sm'>
              Đăng kí
            </button>
          </div>
          <ul className='flex justify-start items-center gap-3'>
            <li>
              <a
                className='w-[38px] h-[38px] hover:bg-yellow-500 hover:text-white flex justify-center items-center bg-white rounded-full'
                href='#'
              >
                <FaFacebookF />{' '}
              </a>
            </li>

            <li>
              <a
                className='w-[38px] h-[38px] hover:bg-yellow-500 hover:text-white flex justify-center items-center bg-white rounded-full'
                href='#'
              >
                <FaTwitter />{' '}
              </a>
            </li>
            <li>
              <a
                className='w-[38px] h-[38px] hover:bg-yellow-500 hover:text-white flex justify-center items-center bg-white rounded-full'
                href='#'
              >
                <FaLinkedin />{' '}
              </a>
            </li>
            <li>
              <a
                className='w-[38px] h-[38px] hover:bg-yellow-500 hover:text-white flex justify-center items-center bg-white rounded-full'
                href='#'
              >
                <FaGithub />{' '}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className='w-[90%] flex flex-wrap justify-center items-center text-slate-600 mx-auto py-5 text-center'>
        <span>Copiright @ 2024 All Rights Reserved </span>
      </div>
    </footer>
  )
}

export default Footer
