'use client'

interface DateFromToProps {
  className?: string
}

export default function DateFromTo({ className }: DateFromToProps) {
  return (
    <div className="flex flex-col items-center text-xs md:flex-row">
      <input
        aria-label="From"
        type="date"
        className="w-[105px] rounded-md border border-slate-200  p-1 text-slate-500"
      />
      <span className="text-slate-300">-</span>
      <input
        aria-label="To"
        type="date"
        className="w-[105px] rounded-md border border-slate-200  p-1 text-slate-500"
      />
    </div>
  )
}
