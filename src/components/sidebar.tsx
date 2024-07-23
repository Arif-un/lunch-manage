'use client'

import { useEffect } from 'react'

import { ChevronLeftIcon } from '@radix-ui/react-icons'
import { useAtom } from 'jotai'
import { usePathname, useRouter } from 'next/navigation'

import userPreferenceAtom from '../global-states/user-preference-atom'
import { cn, dateToday } from '../lib/utils'
import { logoutAction } from '../server/authAction'
import { Button } from './ui/button'

export default function Sidebar() {
  const [{ isOpenSidebar }, setUserPref] = useAtom(userPreferenceAtom)
  const pathName = usePathname()
  const date = dateToday()
  const router = useRouter()

  useEffect(() => {
    navigator.vibrate([1])
  }, [isOpenSidebar])

  const handleRoutes = (to: string) => () => {
    setTimeout(() => {
      router.push(to)
    }, 300)
    setUserPref(prv => ({ ...prv, isOpenSidebar: false }))
  }

  return (
    <nav className={`fixed ${cn(isOpenSidebar ? 'sidebar h-full w-48' : 'size-0 overflow-hidden')}`}>
      <div
        className={`mx-2 mb-6 mt-12 flex items-center gap-2 transition-opacity duration-500 ${cn(isOpenSidebar ? 'opacity-100' : 'opacity-0')}`}
      >
        <Button
          variant="ghost"
          className="gap-3 border-slate-700 bg-black text-white"
          onClick={() => setUserPref(prv => ({ ...prv, isOpenSidebar: false }))}
        >
          <ChevronLeftIcon stroke="2" className="size-5 stroke-current" />
          <h2 className=" text-sm text-slate-400">Close</h2>
        </Button>
      </div>

      <div className="mx-8 mt-6 flex flex-col gap-3 px-5 ">
        <Button
          variant="link"
          onClick={handleRoutes(`/?date=${date}`)}
          className={cn([
            pathName === '/' ? 'text-white font-semibold' : 'text-slate-400 font-light',
            'p-0 justify-start'
          ])}
        >
          Meals
        </Button>
        <Button
          variant="link"
          onClick={handleRoutes(`/users`)}
          className={cn([
            pathName === '/users' ? 'text-white font-semibold' : 'text-slate-400 font-light',
            'p-0 justify-start'
          ])}
        >
          Users
        </Button>
        <Button
          variant="link"
          onClick={handleRoutes(`/payments`)}
          className={cn([
            pathName === '/payments' ? 'text-white font-semibold' : 'text-slate-400 font-light',
            'p-0 justify-start'
          ])}
        >
          Payments
        </Button>
        <Button
          variant="link"
          className="justify-start p-0 font-light text-slate-400"
          onClick={() => logoutAction()}
        >
          Logout
        </Button>
      </div>
    </nav>
  )
}
