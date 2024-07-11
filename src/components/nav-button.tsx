'use client'

import { useEffect } from 'react'

import { HamburgerMenuIcon } from '@radix-ui/react-icons'
import { useSetAtom } from 'jotai'

import userPreferenceAtom from '../global-states/user-preference-atom'
import { Button } from './ui/button'

export default function NavButton() {
  const setUserPref = useSetAtom(userPreferenceAtom)

  useEffect(() => {
    setUserPref(prv => ({ ...prv, isOpenSidebar: false }))
  }, [])

  return (
    <Button
      variant="outline"
      size="icon"
      className=""
      onClick={() => setUserPref(prv => ({ ...prv, isOpenSidebar: !prv.isOpenSidebar }))}
    >
      <HamburgerMenuIcon stroke="2px" />
    </Button>
  )
}
