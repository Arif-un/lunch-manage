import PriceSetter from './price-setter'

export default function TotalBar({ price, quantity }: { price: number; quantity: number }) {
  const totalFormatted = (price * quantity).toFixed(0)
  return (
    <div className="flex  items-center justify-between rounded-md border p-2 md:w-4/6">
      <span className="text-slate-400">Total</span>

      <div className="flex items-center gap-1 text-sm font-normal">
        <span>{quantity}</span>
        <span>X</span>
        <PriceSetter price={price} />
        <span>=</span>
        <span className="font-semibold text-slate-600">{totalFormatted}</span>
      </div>
    </div>
  )
}
