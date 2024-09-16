import Link from 'next/link'

import { Button } from '@/src/components/ui/button'
import { cn } from '@/src/lib/utils'

interface PaginationProps {
  currentPage: number
  totalPages: number
  itemsPerPage: number
  baseUrl: string
}

export function Pagination({ currentPage, totalPages, itemsPerPage, baseUrl }: PaginationProps) {
  const generatePaginationLinks = () => {
    const links = []
    const maxVisiblePages = 5
    const halfMaxPages = Math.floor(maxVisiblePages / 2)

    let startPage = Math.max(1, currentPage - halfMaxPages)
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    if (startPage > 1) {
      links.push(
        <Button key="start" asChild variant="outline" size="sm">
          <Link href={`${baseUrl}?page=1&item=${itemsPerPage}`}>1</Link>
        </Button>
      )
      if (startPage > 2) links.push(<span key="startEllipsis">...</span>)
    }

    for (let i = startPage; i <= endPage; i += 1) {
      links.push(
        <Button key={i} asChild variant={i === currentPage ? 'default' : 'outline'} size="sm">
          <Link href={`${baseUrl}?page=${i}&item=${itemsPerPage}`}>{i}</Link>
        </Button>
      )
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) links.push(<span key="endEllipsis">...</span>)
      links.push(
        <Button key="end" asChild variant="outline" size="sm">
          <Link href={`${baseUrl}?page=${totalPages}&item=${itemsPerPage}`}>{totalPages}</Link>
        </Button>
      )
    }

    return links
  }

  return (
    <div className="mt-4 flex justify-center space-x-2">
      <Button
        asChild
        variant="outline"
        className={cn(!(currentPage > 1) && 'pointer-events-none bg-slate-100 text-slate-500')}
      >
        <Link href={`${baseUrl}?page=${currentPage - 1}&item=${itemsPerPage}`}>Prev</Link>
      </Button>
      {generatePaginationLinks()}
      <Button
        asChild
        variant="outline"
        className={cn(!(currentPage < totalPages) && 'pointer-events-none bg-slate-100 text-slate-500')}
      >
        <Link href={`${baseUrl}?page=${currentPage + 1}&item=${itemsPerPage}`}>Next</Link>
      </Button>
    </div>
  )
}
