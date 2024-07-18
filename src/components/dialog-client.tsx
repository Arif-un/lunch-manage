'use client'

import { type ReactNode } from 'react'

import { useRouter } from 'next/navigation'

import { Dialog } from '@/src/components/ui/dialog'

export default function DialogClient({ children, open }: { children: ReactNode; open: boolean }) {
  const router = useRouter()

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      router.back()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {children}
    </Dialog>
  )
}
