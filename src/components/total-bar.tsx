export default function TotalBar() {
  return (
    <div className="fixed bottom-0 m-1 flex w-11/12 items-center justify-between rounded-md border p-3 md:w-4/6">
      <span className="text-slate-400">Total</span>

      <div className="flex items-center gap-1">
        <span>10</span>
        <span>X</span>
        <span className="rounded bg-slate-100 p-0.5 px-2">95</span>
        <span>= 950</span>
      </div>
    </div>
  )
}
