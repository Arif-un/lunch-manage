import { fetchUsers } from '../server/usersActions'

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
            <span className="text-xs text-slate-500">{user.email}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
