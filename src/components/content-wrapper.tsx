'use client'

import { useAtom } from 'jotai'

import userPreferenceAtom from '../global-states/user-preference-atom'
import { cn } from '../lib/utils'

export default function ContentWrapper({ children }: { children: React.ReactNode }) {
  const [{ isOpenSidebar }, setSideBar] = useAtom(userPreferenceAtom)
  const handlePanelClick = () => {
    if (!isOpenSidebar) return
    setSideBar(prv => ({ ...prv, isOpenSidebar: false }))
  }

  return (
    <div className={`content-transform-transition ${cn(isOpenSidebar && 'content-aside')}`}>
      {isOpenSidebar && (
        <div
          tabIndex={0}
          role="button"
          aria-label="Main panel open"
          onKeyUp={handlePanelClick}
          onClick={handlePanelClick}
          className="fixed size-full"
        />
      )}
      {children}
    </div>
  )
}
