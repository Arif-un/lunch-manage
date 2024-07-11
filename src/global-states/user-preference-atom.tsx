import { atomWithStorage } from 'jotai/utils'

const userPreferenceAtom = atomWithStorage('user-preference', {
  isOpenSidebar: false
})

export default userPreferenceAtom
