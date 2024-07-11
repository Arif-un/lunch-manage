'use server'

import { redirect } from 'next/navigation'

import { login, logout } from '@/src/lib/auth'

/**
 *
 * @param formData
 */
export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const success = await login(email, password)
  return { success }
}

/**
 *
 */
export async function logoutAction() {
  await logout()
  return redirect('/login')
}
