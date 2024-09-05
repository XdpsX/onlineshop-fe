import { FaPlus } from 'react-icons/fa'

const AddButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className='mb-4 flex'>
      <button
        onClick={onClick}
        className='px-5 py-3 flex items-center gap-3 text-white bg-green-500 transition-colors hover:bg-green-600 cursor-pointer rounded-md'
        type='button'
      >
        <FaPlus size={28} />
        <span className='text-xl'>Thêm</span>
      </button>
    </div>
  )
}
export default AddButton
