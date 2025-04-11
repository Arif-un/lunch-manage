'use client'

import { useEffect } from 'react'

import { ChevronLeftIcon, PersonIcon } from '@radix-ui/react-icons'
import { useAtom } from 'jotai'
import { usePathname, useRouter } from 'next/navigation'
import useSWR from 'swr'

import userPreferenceAtom from '../global-states/user-preference-atom'
import { cn, dateToday } from '../lib/utils'
import { logoutAction } from '../server/authAction'
import { Button } from './ui/button'

interface User {
  id: number
  name: string
  email: string
}

// Fetcher function for SWR
const fetcher = (url: string) =>
  fetch(url).then(res => {
    if (res.ok) return res.json()
    return null
  })

export default function Sidebar() {
  const [{ isOpenSidebar }, setUserPref] = useAtom(userPreferenceAtom)
  const pathName = usePathname()
  const date = dateToday()
  const router = useRouter()

  // Use SWR to fetch user data with automatic revalidation
  const { data } = useSWR('/api/users/me', fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: true
  })

  // Extract user data from response
  const user: User | null = data?.user ?? null

  useEffect(() => {
    navigator.vibrate([1])
  }, [isOpenSidebar])

  const handleRoutes = (to: string) => () => {
    setTimeout(() => {
      router.push(to)
    }, 300)
    setUserPref(prv => ({ ...prv, isOpenSidebar: false }))
  }

  // Extract first name from the full name
  const firstName = user?.name ? user.name.split(' ')[0] : 'Profile'

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
        {/* Profile link with user's first name */}
        <Button
          variant="link"
          onClick={handleRoutes(`/profile`)}
          className={cn([
            pathName === '/profile' ? 'text-white font-semibold' : 'text-slate-400 font-light',
            'p-0 justify-start flex items-center'
          ])}
        >
          <PersonIcon className="mr-2 size-4" />
          {firstName}
        </Button>

        <div className="my-2 border-t border-slate-700" />

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
