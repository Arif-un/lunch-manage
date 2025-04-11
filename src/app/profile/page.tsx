'use client'

import { ChevronLeftIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'

import BackBtnClient from '@/src/components/back-btn-client'
import ContentWrapper from '@/src/components/content-wrapper'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent } from '@/src/components/ui/card'
import { Label } from '@/src/components/ui/label'

interface User {
  id: number
  name: string
  email: string
  role?: number
  status?: string
  balance?: number
}

// Fetcher function for SWR
const fetcher = (url: string) =>
  fetch(url).then(res => {
    if (!res.ok) {
      if (res.status === 401) {
        // Redirect to login if unauthorized
        window.location.href = '/login'
        return null
      }
      throw new Error('Failed to fetch profile data')
    }
    return res.json()
  })

export default function ProfilePage() {
  const router = useRouter()

  // Use SWR to fetch user data with automatic revalidation
  const { data, error, isLoading } = useSWR('/api/users/me', fetcher, {
    revalidateOnFocus: true,
    revalidateIfStale: true,
    shouldRetryOnError: false
  })

  // Extract user data from response
  const user: User | null = data?.user ?? null

  if (isLoading) {
    return (
      <ContentWrapper>
        <main className="flex min-h-screen flex-col items-center bg-slate-50">
          <div className="w-10/12 md:w-3/6 mt-5">
            <div className="text-center">Loading profile...</div>
          </div>
        </main>
      </ContentWrapper>
    )
  }

  return (
    <ContentWrapper>
      <main className="flex min-h-screen flex-col items-center bg-slate-50">
        <div className="w-10/12 md:w-3/6">
          <div className="my-3 flex items-center gap-3">
            <BackBtnClient type="button" size={'icon'} variant={'outline'}>
              <ChevronLeftIcon />
            </BackBtnClient>
            <h2 className="font-semibold">My Profile</h2>
          </div>

          {error ? (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
              Failed to load profile data. Please try again.
            </div>
          ) : (
            <Card className="mt-4">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-sm text-slate-500">Name</Label>
                      <p className="text-lg font-medium">{user?.name}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm text-slate-500">Email</Label>
                      <p className="text-lg">{user?.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-sm text-slate-500">Status</Label>
                      <p className="text-lg">
                        <span
                          className={`capitalize ${user?.status === 'active' ? 'text-green-600' : 'text-red-600'}`}
                        >
                          {user?.status || 'Active'}
                        </span>
                      </p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm text-slate-500">Balance</Label>
                      <p className="text-lg font-bold">৳ {user?.balance || 0}</p>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button asChild className="w-full">
                      <Link href={`/users/edit/${user?.id}`}>Edit Profile</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </ContentWrapper>
  )
}
