'use client'

import { useEffect, useState } from 'react'
import { use } from 'react'

import { ChevronLeftIcon } from '@radix-ui/react-icons'
import { useRouter } from 'next/navigation'

import BackBtnClient from '@/src/components/back-btn-client'
import ContentWrapper from '@/src/components/content-wrapper'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/src/components/ui/select'
import { updateUser } from '@/src/server/usersActions'

interface User {
  id: number
  name: string
  email: string
  role?: number
  status?: string
  balance?: number
}

interface Props {
  params: {
    userId: string
  }
}

export default function EditUser({ params }: Props) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isSelfEdit, setIsSelfEdit] = useState(false)
  const unwrappedParams = use(params)
  const userId = parseInt(unwrappedParams.userId, 10)

  // Fetch user data and check current user's permissions
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch the user to edit
        const response = await fetch(`/api/users/${userId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch user')
        }

        const userData = await response.json()
        setUser(userData.user)

        // Check if current user is admin and if they're editing themselves
        setIsAdmin(userData.isAdmin)
        setIsSelfEdit(userData.isSelfEdit)

        // If not admin and not self edit, redirect back to users page
        if (!userData.isAdmin && !userData.isSelfEdit) {
          router.push('/users')
        }
      } catch (err) {
        console.error(err)
        setError('Failed to fetch user data. Please try again.')
      }
    }

    fetchData()
  }, [userId, router])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const status = isAdmin ? (formData.get('status') as string) : undefined

    if (!name || !email) {
      setError('Name and email are required')
      setIsSubmitting(false)
      return
    }

    try {
      const updateData: {
        name: string
        email: string
        password?: string
        status?: string
      } = {
        name,
        email
      }

      // Only include password if it's provided (to allow updating without changing password)
      if (password) {
        updateData.password = password
      }

      // Admin can update status
      if (isAdmin && status) {
        updateData.status = status
      }

      await updateUser(userId, updateData)
      setSuccess(true)

      // Refresh the page after successful update
      setTimeout(() => {
        router.refresh()
      }, 1500)
    } catch (err: any) {
      setError(err.message || 'Failed to update user. Please try again.')
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) {
    return (
      <ContentWrapper>
        <main className="flex min-h-screen flex-col items-center bg-slate-50">
          <div className="w-10/12 md:w-3/6">
            <div className="my-3 flex items-center gap-3">
              <BackBtnClient type="button" size={'icon'} variant={'outline'}>
                <ChevronLeftIcon />
              </BackBtnClient>
              <h2 className="font-semibold">Edit User</h2>
            </div>
            <div className="rounded-md border bg-white p-6">
              {error ? (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">{error}</div>
              ) : (
                <div className="text-center">Loading user data...</div>
              )}
            </div>
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
            <h2 className="font-semibold">Edit User: {user.name}</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 rounded-md border bg-white p-6">
            {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">{error}</div>}
            {success && (
              <div className="rounded-md bg-green-50 p-3 text-sm text-green-800">
                User updated successfully!
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" defaultValue={user.name} placeholder="Full Name" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={user.email}
                placeholder="Email Address"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                Password {!isSelfEdit && '(leave blank to keep current password)'}
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder={
                  isSelfEdit ? 'New Password (min 6 characters)' : 'Leave blank to keep current password'
                }
                minLength={6}
              />
            </div>

            {/* Only show status field to admin users */}
            {isAdmin && (
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select name="status" defaultValue={user.status || 'active'}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update User'}
            </Button>
          </form>
        </div>
      </main>
    </ContentWrapper>
  )
}
