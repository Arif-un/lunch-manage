'use client'

import { useEffect } from 'react'
import { type ReactNode } from 'react'

import { useRouter } from 'next/navigation'

import { Dialog } from '@/src/components/ui/dialog'

export default function DialogClient({
  children,
  open,
  actionResult
}: {
  children: ReactNode
  open: boolean
  actionResult?: { success?: boolean; error?: string }
}) {
  const router = useRouter()

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      router.back()
    }
  }

  useEffect(() => {
    if (actionResult?.success) {
      // Close the modal by navigating back, then redirect to payments page
      router.back()

      // Small delay to ensure the back navigation completes first
      setTimeout(() => {
        router.push('/payments')
      }, 100)
    }
  }, [actionResult, router])

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {children}
    </Dialog>
  )
}
