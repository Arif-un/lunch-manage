'use client'

import { useState } from 'react'

import { ChevronLeftIcon } from '@radix-ui/react-icons'
import { useRouter } from 'next/navigation'

import BackBtnClient from '@/src/components/back-btn-client'
import ContentWrapper from '@/src/components/content-wrapper'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import { createUser } from '@/src/server/usersActions'

export default function CreateUser() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!name || !email || !password) {
      setError('All fields are required')
      setIsSubmitting(false)
      return
    }

    try {
      await createUser(name, email, password)
      router.push('/users')
      router.refresh()
    } catch (err) {
      setError('Failed to create user. Please try again.')
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ContentWrapper>
      <main className="flex min-h-screen flex-col items-center bg-slate-50">
        <div className="w-10/12 md:w-3/6">
          <div className="my-3 flex items-center gap-3">
            <BackBtnClient type="button" size="icon" variant="outline">
              <ChevronLeftIcon />
            </BackBtnClient>
            <h2 className="font-semibold">Create New User</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 rounded-md border bg-white p-6">
            {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">{error}</div>}

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" placeholder="Full Name" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="Email Address" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Password (min 6 characters)"
                required
                minLength={6}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create User'}
            </Button>
          </form>
        </div>
      </main>
    </ContentWrapper>
  )
}
