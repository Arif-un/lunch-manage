'use client'

import { useRouter } from 'next/navigation'

import { Button, type ButtonProps } from './ui/button'

export default function BackBtnClient({ onClick, ...props }: ButtonProps) {
  const router = useRouter()

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    router.back()
    onClick?.(e)
  }

  return <Button {...props} onClick={handleClick} />
}
