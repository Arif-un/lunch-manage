'use client'

import { ChevronLeftIcon } from '@radix-ui/react-icons'
import { useAtom } from 'jotai'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import userPreferenceAtom from '../global-states/user-preference-atom'
import { cn } from '../lib/utils'
import { logoutAction } from '../server/authAction'
import { Button } from './ui/button'

export default function Sidebar() {
  const [{ isOpenSidebar }, setUserPref] = useAtom(userPreferenceAtom)
  const pathName = usePathname()
  return (
    <nav className={`fixed ${cn(isOpenSidebar ? 'h-full w-48' : 'size-0 overflow-hidden')}`}>
      <div
        className={`mx-2 my-14 flex items-center gap-4 transition-opacity duration-500 ${cn(isOpenSidebar ? 'opacity-100' : 'opacity-0')}`}
      >
        <Button
          variant="ghost"
          size="icon"
          className="border-slate-700 bg-black text-white"
          onClick={() => setUserPref({ isOpenSidebar: !isOpenSidebar })}
        >
          <ChevronLeftIcon stroke="2" className="size-5 stroke-current" />
        </Button>
        <h2 className="font-semibold text-white">Meal Manager</h2>
      </div>

      <div className="mx-10 mt-10 flex flex-col gap-3 px-5  text-slate-400">
        <Link href="/" className={cn(pathName === '/' && 'text-white font-semibold')}>
          Meals
        </Link>
        <Link href="/users" className={cn(pathName === '/users' && 'text-white font-semibold')}>
          Users
        </Link>
        <Link href="/payments" className={cn(pathName === '/payments' && 'text-white font-semibold')}>
          Payments
        </Link>
        <button className="-ml-4 p-0" type="button" onClick={() => logoutAction()}>
          Logout
        </button>
      </div>
    </nav>
  )
}
