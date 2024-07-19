'use client'

import { useEffect, useState } from 'react'

import { useSetAtom } from 'jotai'
import { useRouter } from 'next/navigation'

import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Input } from '@/src/components/ui/input'
import userPreferenceAtom from '@/src/global-states/user-preference-atom'
import { loginAction } from '@/src/server/authAction'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const setUserPref = useSetAtom(userPreferenceAtom)

  useEffect(() => {
    setUserPref(prv => ({ ...prv, isOpenSidebar: false }))
  }, [setUserPref])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', password)

    const { success } = (await loginAction(formData)) || {}
    if (success) {
      router.push('/')
    } else {
      alert('Login failed')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Input
                  id="email"
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Input
                  id="password"
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
