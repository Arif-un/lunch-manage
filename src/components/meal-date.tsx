'use client'

import { useRouter } from 'next/navigation'

import { dateToday } from '../lib/utils'

export default function MealDate() {
  const { query } = useRouter()
  const a = new URLSearchParams(window.location.href)
  console.log("==== :", a.has('date'))

  const date = dateToday()

  const handleDate = () => { }

  return (
    <div className="flex items-center gap-2 text-slate-700">
      <input
        className="rounded-md border p-1 px-2 text-sm text-slate-600"
        aria-label="Date"
        type="date"
        value={date}
        onChange={handleDate}
      />
    </div>
  )
}
