import { Button } from '@/src/components/ui/button'

import ContentWrapper from '../components/content-wrapper'
import NavButton from '../components/nav-button'
import TotalBar from '../components/total-bar'
import { fetchUsers } from '../server/usereActions'

export default async function Home() {
  const users = await fetchUsers()
  const today = new Date()
  const todayFormattedDate = today.toISOString().split('T')[0]

  return (
    <ContentWrapper>
      <main className="flex min-h-screen flex-col items-center bg-background">
        <div className="w-11/12 md:w-4/6 ">
          <div className="my-2 flex justify-between">
            <NavButton />
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Date:</span>
              <input aria-label="Date" type="date" value={todayFormattedDate} />
            </div>
          </div>

          <div className="grid w-full grid-cols-2 place-content-center gap-4 border p-4">
            {users?.map(user => (
              <Button
                key={user.id}
                variant="outline"
                className="flex h-10 items-center justify-start space-x-4 text-left"
              >
                <span className="size-4 rounded border border-slate-600" />
                <span>{user.name}</span>
              </Button>
            ))}
          </div>
          <TotalBar />
        </div>
      </main>
    </ContentWrapper>
  )
}
