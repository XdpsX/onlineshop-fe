interface SortProps {
  selectOpt: string
  options: {
    id: number
    title: string
    value: string
  }[]
  onSortChange: (sort: string) => void
}

const Sort = ({ selectOpt, options, onSortChange }: SortProps) => {
  return (
    <select
      value={selectOpt}
      onChange={(e) => onSortChange(e.target.value)}
      className=' ps-2 py-2 text-sm md:text-lg focus:border-indigo-500 outline-none bg-white border border-slate-700 rounded-md text-black'
    >
      {options.map((option) => (
        <option key={option.id} value={option.value}>
          {option.title}
        </option>
      ))}
    </select>
  )
}
export default Sort
