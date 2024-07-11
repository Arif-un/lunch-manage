'use client'

import { useAtomValue } from 'jotai'

import userPreferenceAtom from '../global-states/user-preference-atom'
import { cn } from '../lib/utils'

export default function ContentWrapper({ children }: { children: React.ReactNode }) {
  const { isOpenSidebar } = useAtomValue(userPreferenceAtom)
  return (
    <div className={`content-transform-transition ${cn(isOpenSidebar && 'content-aside')}`}>
      {children}
    </div>
  )
}
