'use client'

import { useState } from 'react'

import { CheckIcon, Cross2Icon, DotsHorizontalIcon } from '@radix-ui/react-icons'
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

import { cn, dateToday, mutator } from '../lib/utils'
import { Button } from './ui/button'

export default function MealButton({ name, id, price }: { name: string; id: number; price?: number }) {
  const { trigger, isMutating } = useSWRMutation(`/api/meals/${id}`, mutator)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const date = dateToday()

  const isMealActive = price !== undefined && price > 0
  const isMealOff = price !== undefined && price === 0
  const isMealNotUpdatedYet = price === undefined
  const [selectedStatus, setSelectedStatus] = useState((isMealActive && 'yes') || (isMealOff && 'no'))


  const handleStatus = (status: 'yes' | 'no') => async () => {
    if (selectedStatus === status) {
      setDrawerOpen(false)
      return
    }

    setSelectedStatus(status)
    const res = await trigger({ userId: id, status, date })
    if (res.success) {
      setDrawerOpen(false)
    } else {
      console.error(res)
    }
  }

  const isYesSelecting = isMutating && selectedStatus === 'yes'
  const isNoSelecting = isMutating && selectedStatus === 'no'

  return (
    <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className={`flex h-10 items-center justify-start space-x-4 text-left active:bg-blue-300 ${cn([
            isMealActive && 'bg-slate-900 text-white',
            isMealOff && 'bg-slate-50 shadow-none text-slate-600'
          ])}`}
        >
          <span
            className={`flex size-4 items-center justify-center rounded border ${cn([
              isMealActive && 'border-slate-400',
              isMealNotUpdatedYet && 'border-slate-600',
              isMealOff && 'border-slate-400'
            ])}`}
          >
            {isMealActive && <CheckIcon />}
            {isMealOff && <Cross2Icon />}
          </span>
          <span>{name}</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle className="text-slate-400">
              Update <span className="text-slate-900">{name}'s</span> lunch
            </DrawerTitle>
            <DrawerDescription />
          </DrawerHeader>

          <div className="mx-4 my-7 flex gap-3">
            <Button
              disabled={isMutating}
              onClick={handleStatus('no')}
              className={`w-full ${cn([
                isMealNotUpdatedYet && 'border-red-100 bg-red-50 text-red-950',
                isMealOff && 'bg-slate-900 text-red-50 border-red-100'
              ])}`}
              variant="outline"
            >
              {isNoSelecting ? <DotsHorizontalIcon className="h-9 w-8  animate-pulse " /> : 'No'}
            </Button>
            <Button
              disabled={isMutating}
              onClick={handleStatus('yes')}
              className={`w-full ${cn([
                isMealActive && 'bg-slate-900 text-green-50 border-green-100',
                isMealNotUpdatedYet && 'border-green-100 bg-green-50 text-green-950'
              ])}`}
              variant="outline"
            >
              {isYesSelecting ? <DotsHorizontalIcon className="h-9 w-8  animate-pulse " /> : 'Yes'}
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
