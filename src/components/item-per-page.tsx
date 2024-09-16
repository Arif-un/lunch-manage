'use client'

import { useRouter, useSearchParams } from 'next/navigation'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

const ITEMS_PER_PAGE_OPTIONS = ['10', '20', '50', '100']

export function useUpdateSearchParam() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateSearchParam = (name: string, value: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()))

    if (!value) {
      current.delete(name)
    } else {
      current.set(name, value)
    }

    const search = current.toString()
    const query = search ? `?${search}` : ''

    router.replace(`${window.location.pathname}${query}`)
  }

  return updateSearchParam
}

export default function ItemPerPage({ defaultItemsPerPage = 20 }: { defaultItemsPerPage?: number }) {
  const updateSearchParam = useUpdateSearchParam()
  const searchParams = useSearchParams()

  const currentItemPerPage = searchParams.get('item') || defaultItemsPerPage.toString()

  if (!ITEMS_PER_PAGE_OPTIONS.includes(currentItemPerPage)) {
    ITEMS_PER_PAGE_OPTIONS.push(currentItemPerPage)
    ITEMS_PER_PAGE_OPTIONS.sort((a, b) => Number(a) - Number(b))
  }

  const handleValueChange = (value: string) => {
    updateSearchParam('item', value)
  }

  return (
    <Select defaultValue={currentItemPerPage} onValueChange={handleValueChange}>
      <SelectTrigger className="h-9 w-[180px] text-xs text-slate-500">
        <SelectValue placeholder="Items per page" />
      </SelectTrigger>
      <SelectContent>
        {ITEMS_PER_PAGE_OPTIONS.map(option => (
          <SelectItem key={option} value={option.toString()}>
            {option} items per page
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
