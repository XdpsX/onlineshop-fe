import { ReactNode } from 'react'

function Heading({ children }: { children: ReactNode }) {
  return (
    <div className='w-full'>
      <div className='text-center flex justify-center items-center flex-col text-4xl text-slate-600 font-bold relative mb-12'>
        <h2>{children}</h2>
        <div className='w-24 h-[2px] bg-yellow-400 mt-4'></div>
      </div>
    </div>
  )
}
export default Heading
