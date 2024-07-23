import { getMealPrice } from '../app/api/meals/[userId]/route'
import PriceSetter from './price-setter'

export default async function TotalBar({ quantity, date }: { quantity: number; date: string }) {
  const price = await getMealPrice(date)

  const totalFormatted = (price * quantity).toFixed(0)
  return (
    <div className="flex items-center justify-between rounded-md border p-2 px-3">
      <span className="text-slate-400">Total</span>

      <div className="flex items-center gap-1 text-sm font-normal">
        <span>{quantity}</span>
        <span>X</span>
        <PriceSetter price={price} date={date} />
        <span>=</span>
        <span className="font-semibold text-slate-600">{totalFormatted}</span>
      </div>
    </div>
  )
}
