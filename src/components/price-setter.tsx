'use client'

import { useState } from 'react'

import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/src/components/ui/drawer'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/src/components/ui/select'

import { dateToday, fetcher, mutator } from '../lib/utils'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'

const savedPrices = [
  { label: '95', value: '95' },
  { label: '105', value: '105' },
  { label: '120', value: '120' },
  { label: '150', value: '150' }
]

export default function PriceSetter({ price }: { price: number }) {
  const { trigger: updatePrice, isMutating } = useSWRMutation(`/api/meals/prices/update`, mutator)
  const date = dateToday()
  const { data, isLoading } = useSWR(`/api/meals/prices/${date}`, fetcher)
  // console.log('==== ~ data:', data)

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [newPrice, setNewPrice] = useState(price)
  const isSavedPrice = savedPrices.find(p => p.value === price.toString())
  // console.log('==== ~ isSavedPrice:', isSavedPrice)
  const [predefinedPrice, setPredefinedPrice] = useState(isSavedPrice ? price.toString() : 'custom')
  // const [isCustomPrice, setIsCustomPrice] = useState(false)
  const [note, setNote] = useState('')

  const handlePrice = (e: any) => {
    setNewPrice(e.target.valueAsNumber)
  }

  const handleSave = async () => {
    if (price === newPrice) {
      setDrawerOpen(false)
      return
    }

    const res = await updatePrice({ newPrice, date, note })

    if (res.success) {
      setDrawerOpen(false)
    } else {
      console.error(res)
    }
  }

  return (
    <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="flex p-2 shadow-none">
          {price}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle className="text-slate-400">Set lunch price</DrawerTitle>
            <DrawerDescription />
          </DrawerHeader>

          <div className="m-4 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Label htmlFor="price" className="w-36 text-slate-500">
                Price
              </Label>
              <Select onValueChange={setPredefinedPrice} value={predefinedPrice} disabled={isLoading}>
                <SelectTrigger id="price" className="w-full">
                  <SelectValue placeholder="Select a price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {data?.mealPrices?.map(p => (
                      <SelectItem key={p.id} value={p.price}>
                        <div className="flex">
                          <span className="block w-24">{p.label}</span>
                          <span>{p.price}</span>
                        </div>
                      </SelectItem>
                    ))}
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {!isSavedPrice && (
              <>
                <div className="flex items-center gap-3">
                  <Label htmlFor="custom-price" className="w-36 text-slate-500">
                    Custom Price
                  </Label>
                  <Input
                    value={newPrice}
                    onChange={handlePrice}
                    id="custom-price"
                    type="number"
                    placeholder="Price..."
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Label htmlFor="note" className="w-36 text-slate-500">
                    Note <span className="text-xs">(Optional)</span>
                  </Label>
                  <Input
                    value={note}
                    onChange={({ target: { value } }) => setNote(value)}
                    id="note"
                    type="text"
                    placeholder="Write a reason"
                  />
                </div>
              </>
            )}

            <Button onClick={handleSave} className="my-3" disabled={isMutating}>
              {isMutating ? <DotsHorizontalIcon className="h-9 w-8  animate-pulse " /> : 'Save'}
            </Button>
          </div>

          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
