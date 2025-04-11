'use client'

import { type ChangeEvent } from 'react'
import { useState } from 'react'

import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { useRouter } from 'next/navigation'
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

import { fetcher, mutator } from '../lib/utils'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'

interface MealPrice {
  id: number
  label: string
  price: number
  description: string
  is_default: number
  created_by: number
  updated_by: number
  created_at: number
  updated_at: number
}

interface PricesResponse {
  prices: MealPrice[]
}

export default function PriceSetter({ price, date }: { price: number; date: string }) {
  const { trigger: updatePrice, isMutating } = useSWRMutation(`/api/meals/prices/update`, mutator)
  const { data: { prices } = {}, isLoading } = useSWR<PricesResponse>(`/api/meals/prices`, fetcher)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const CUSTOM_PRICE_DEFAULT = { price, note: '', label: '' }
  const [customPrice, setCustomPrice] = useState(CUSTOM_PRICE_DEFAULT)
  const [predefinedPrice, setPredefinedPrice] = useState(price.toString())
  const router = useRouter()

  if (!prices || isLoading) {
    return (
      <div className="flex size-8 items-center justify-center rounded-md border bg-white p-1">
        <DotsHorizontalIcon />
      </div>
    )
  }

  const handleSave = async () => {
    let isCustomPrice = true
    const { price: newPrice, note, label } = customPrice

    let updatedPrice = newPrice
    if (predefinedPrice !== 'custom') {
      isCustomPrice = false
      updatedPrice = Number(predefinedPrice)
    }

    if (price === updatedPrice) {
      setDrawerOpen(false)
      return
    }

    const res = await updatePrice({ newPrice: updatedPrice, date, note, label, isCustomPrice })

    if (res.success) {
      setDrawerOpen(false)
      router.refresh()
    } else {
      console.error(res)
    }
  }

  const handleCustomPrice = (type: 'price' | 'note' | 'label') => (e: ChangeEvent<HTMLInputElement>) => {
    setCustomPrice(prv => ({
      ...prv,
      [type]: type === 'price' ? e.target.valueAsNumber : e.target.value
    }))
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
                    {prices?.map(p => (
                      <SelectItem key={p.id} value={p.price.toString()}>
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

            {predefinedPrice === 'custom' && (
              <>
                <div className="flex items-center gap-3">
                  <Label htmlFor="note" className="w-36 text-slate-500">
                    Label
                  </Label>
                  <Input
                    value={customPrice.label}
                    onChange={handleCustomPrice('label')}
                    id="note"
                    type="text"
                    placeholder="Label"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Label htmlFor="custom-price" className="w-36 text-slate-500">
                    Custom Price
                  </Label>
                  <Input
                    value={customPrice.price}
                    onChange={handleCustomPrice('price')}
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
                    value={customPrice.note}
                    onChange={handleCustomPrice('note')}
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
