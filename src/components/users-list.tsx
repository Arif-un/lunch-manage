import Link from 'next/link'

import { fetchUsers } from '../server/usersActions'
import { Button } from './ui/button'

export default async function UsersList() {
  const users = await fetchUsers()

  return (
    <div>
      {users?.map(user => (
        <div key={user.id} className="my-2 flex rounded-md border px-3 py-2 text-sm">
          <div className="flex gap-3">
            <div className="flex flex-col">
              <h2 className="w-32">{user.name}</h2>
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
        </div>
      ))}
    </div>
  )
}
