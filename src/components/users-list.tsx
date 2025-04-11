import { Pencil1Icon, PersonIcon } from '@radix-ui/react-icons'
import Link from 'next/link'

import { getSession } from '@/src/lib/auth'

import { fetchUsers } from '../server/usersActions'
import DeleteUserButton from './delete-user-button'
import { Button } from './ui/button'

export default async function UsersList() {
  const users = await fetchUsers()
  const session = await getSession()
  const currentUserId = session?.id

  return (
    <div>
      {users?.map(user => (
        <div key={user.id} className="my-2 flex rounded-md border px-3 py-2 text-sm">
          <div className="flex w-full justify-between">
            <div className="flex gap-3">
              <div className="flex flex-col">
                <h2 className="w-32">
                  {user.name}
                  {user.id === currentUserId && (
                    <span className="ml-2 inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800">
                      You
                    </span>
                  )}
                </h2>
                <div className="flex items-center gap-1">
                  <span className="font-semibold">৳</span>
                  <span>{user.balance}</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-500">{user.email}</span>
                <div>
                  <Button
                    asChild
                    size="sm"
                    className="mr-2 mt-1 h-6 bg-white px-2 py-0 text-xs text-slate-800 hover:bg-slate-50 hover:text-slate-950"
                  >
                    <Link href={`/payments/user/${user.id}`}>Payments</Link>
                  </Button>
                  <Button
                    size="sm"
                    className="mt-1 h-6 bg-white px-2 py-0 text-xs text-slate-800 hover:bg-slate-50 hover:text-slate-950"
                  >
                    Meals
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {user.id === currentUserId && (
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="h-7 px-2 text-xs text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                >
                  <Link href="/profile">
                    <PersonIcon className="mr-1 h-3 w-3" />
                    My Profile
                  </Link>
                </Button>
              )}
              <Button
                asChild
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs text-slate-800 hover:bg-slate-50 hover:text-slate-950"
              >
                <Link href={`/users/edit/${user.id}`}>
                  <Pencil1Icon />
                </Link>
              </Button>
              <DeleteUserButton userId={user.id} userName={user.name} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
