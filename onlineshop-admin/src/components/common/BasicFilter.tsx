import { sortOptions } from '~/utils/data'
import Search from './Search'
import Sort from './Sort'
import { PageResponse } from '~/types/page'

interface BasicFilterProps<T> {
  pageResult: PageResponse<T> | null
  curSearch: string | null
  onSearching: (searchTerm: string) => void
  onClear: () => void
  curSort: string
  onSortChange: (sort: string) => void
}

const BasicFilter = <T,>({
  pageResult,
  curSearch,
  onSearching,
  onClear,
  curSort,
  onSortChange
}: BasicFilterProps<T>) => {
  return (
    <div className='mb-5 flex flex-col gap-2'>
      <div className='flex flex-col md:flex-row gap-3 md:gap-0 justify-between items-center'>
        <Search curSearch={curSearch} onSearching={onSearching} onClear={onClear} />
        <Sort selectOpt={curSort} options={sortOptions} onSortChange={onSortChange} />
      </div>
      {curSearch && pageResult && (
        <p>
          {pageResult.totalItems} results for "{curSearch}"
        </p>
      )}
    </div>
  )
}
export default BasicFilter
