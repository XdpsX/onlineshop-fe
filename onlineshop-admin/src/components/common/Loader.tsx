const Loader = ({ isDark = false }: { isDark?: boolean }) => {
  return (
    <div className='flex h-screen items-center justify-center bg-transparent'>
      <div
        className={`h-16 w-16 animate-spin rounded-full border-4 border-solid border-t-transparent 
        ${isDark ? 'border-white' : 'border-blue-600'}`}
      ></div>
    </div>
  )
}

export default Loader
