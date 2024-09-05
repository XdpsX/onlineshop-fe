import { FormEvent, useState } from 'react'

import { FaSearch, FaEraser } from 'react-icons/fa'

interface SearchProps {
  curSearch: string | null
  onSearching: (searchTerm: string) => void
  onClear: () => void
}

const Search = ({ curSearch, onSearching, onClear }: SearchProps) => {
  const [searchTerm, setSearchTerm] = useState(curSearch || '')

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    onSearching(searchTerm)
    setSearchTerm('')
  }

  const handleClear = () => {
    setSearchTerm('')
    onClear()
  }

  return (
    <form
      onSubmit={handleSearch}
      className='border border-gray-400 inline-flex justify-between items-center bg-white rounded-md'
    >
      <input
        onChange={(e) => setSearchTerm(e.target.value)}
        value={searchTerm}
        className='px-1 md:px-2 focus:border-indigo-500 outline-none rounded-s-md text-black'
        type='text'
        placeholder='Tìm kiếm...'
      />
      <button
        type='submit'
        className='text-center text-white bg-blue-500 p-1 md:p-2 transition-colors hover:bg-blue-600'
      >
        <FaSearch size={28} title='Tìm kiếm' />
      </button>
      <button
        type='button'
        onClick={handleClear}
        className='text-center text-white bg-gray-400 p-1 md:p-2 rounded-e-md transition-colors hover:bg-gray-500'
      >
        <FaEraser size={28} title='Xoá' />
      </button>
    </form>
  )
}
export default Search
