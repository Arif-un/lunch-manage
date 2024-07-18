import ContentWrapper from '@/src/components/content-wrapper'
import NavButton from '@/src/components/nav-button'
import UsersList from '@/src/components/users-list'

export default async function Users() {
  return (
    <ContentWrapper>
      <main className="flex min-h-screen flex-col items-center bg-slate-50">
        <div className="w-11/12 md:w-4/6 ">
          <div className="my-3 flex items-center gap-3">
            <NavButton />
            <h2 className="font-semibold">Users</h2>
          </div>
          <UsersList />
        </div>
      </main>
    </ContentWrapper>
  )
}
