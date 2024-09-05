import { useEffect, useState } from 'react'

interface PaginationProps {
  pageNum: number
  totalPages: number
  onPageChange: (pageNum: number) => void
}

const Pagination = ({ pageNum, totalPages, onPageChange }: PaginationProps) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 640) // 640px là kích thước breakpoint cho sm
    }

    handleResize() // Kiểm tra kích thước khi component mount
    window.addEventListener('resize', handleResize) // Thêm event listener

    return () => {
      window.removeEventListener('resize', handleResize) // Cleanup
    }
  }, [])

  const handleFirstPage = () => {
    onPageChange(1)
  }

  const handleLastPage = () => {
    onPageChange(totalPages)
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page)
    }
  }

  const renderPageNumbers = () => {
    const pageNumbers = []
    let startPage = Math.max(pageNum - 1, 1)
    let endPage = Math.min(pageNum + 1, totalPages)

    if (isSmallScreen) {
      // Nếu là màn hình nhỏ, chỉ hiển thị 3 nút
      startPage = Math.max(pageNum - 1, 1)
      endPage = Math.min(pageNum + 1, totalPages)
    } else {
      // Nếu không, hiển thị 5 nút
      startPage = Math.max(pageNum - 2, 1)
      endPage = Math.min(pageNum + 2, totalPages)
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          disabled={pageNum === i}
          className={`text-sm px-4 py-2 border rounded ${
            pageNum === i ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'
          }`}
        >
          {i}
        </button>
      )
    }
    return pageNumbers
  }

  return (
    <div className='mx-auto flex justify-center items-center space-x-2 mt-4'>
      <button
        onClick={handleFirstPage}
        disabled={pageNum === 1}
        className='text-sm px-4 py-2 border rounded bg-white text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'
      >
        Đầu
      </button>
      {renderPageNumbers()}
      <button
        onClick={handleLastPage}
        disabled={pageNum === totalPages}
        className='text-sm px-4 py-2 border rounded bg-white text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'
      >
        Cuối
      </button>
    </div>
  )
}

export default Pagination
