'use client'

import { useEffect, useState } from 'react'

import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons'
import { useRouter } from 'next/navigation'

import { Button } from './ui/button'

export default function MealDate({ date }: { date: string }) {
  const router = useRouter()
  const [mealDate, setMealDate] = useState(date)

  useEffect(() => {
    router.replace(`/?date=${mealDate}`)
  }, [mealDate, router])

  useEffect(() => {
    setMealDate(date)
  }, [date])

  const handleDate = e => {
    setMealDate(e.target.value)
  }

  const updateDate = (type: 'INC' | 'DEC') => () => {
    const jsDate = new Date(mealDate)
    const dateOnly = jsDate.getDate()
    const updatedDate = type === 'DEC' ? dateOnly + 1 : dateOnly - 1
    jsDate.setDate(updatedDate)
    const formattedUpdateDate = jsDate.toISOString().split('T')[0]

    navigator.vibrate([10, 20])
    setMealDate(formattedUpdateDate)
  }

  return (
    <div className="flex items-center gap-0 text-slate-700">
      <Button onClick={updateDate('INC')} variant="ghost" size="icon" className="size-7 text-slate-300">
        <ChevronLeftIcon className="size-5" />
      </Button>
      <input
        className="w-32 rounded-md border bg-slate-100 p-1 px-2 text-sm text-slate-500"
        aria-label="Date"
        type="date"
        value={mealDate}
        onChange={handleDate}
      />
      <Button onClick={updateDate('DEC')} variant="ghost" size="icon" className="size-7 text-slate-300">
        <ChevronRightIcon className="size-5" />
      </Button>
    </div>
  )
}
