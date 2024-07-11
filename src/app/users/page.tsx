import ContentWrapper from '@/src/components/content-wrapper'
import NavButton from '@/src/components/nav-button'
import UsersList from '@/src/components/users-list'

export default async function Users() {
  return (
    <ContentWrapper>
      <main className="flex min-h-screen flex-col items-center bg-background">
        <div className="w-11/12 md:w-4/6 ">
          <NavButton />
          <h1 className="text-4xl font-bold">Users</h1>
          <p className="text-lg text-gray-500">This is the users page</p>
          <UsersList />
        </div>
      </main>
    </ContentWrapper>
  )
}
