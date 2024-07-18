import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { permanentRedirect, redirect } from 'next/navigation'
import z from 'zod'

import BackBtnClient from '@/src/components/back-btn-client'
import DialogClient from '@/src/components/dialog-client'
import { Button } from '@/src/components/ui/button'
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/src/components/ui/dialog'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/src/components/ui/select'
import { Textarea } from '@/src/components/ui/textarea'
import { getSession } from '@/src/lib/auth'
import db from '@/src/lib/db/connection'
import payments from '@/src/lib/db/schema/Payments'
import PaymentsLog from '@/src/lib/db/schema/PaymentsLog'
import { fetchUsers } from '@/src/server/usersActions'

const formValidation = z.object({
  amount: z.number().positive('Amount must be a positive number'),
  paid_by: z.number({ required_error: 'Paid by is required' }),
  paid_to: z.number({ required_error: 'Paid to is required' }),
  note: z.string(),
  updated_by: z.number({ required_error: 'Updated by is required' })
})

async function fetchPaymentById(id: string) {
  const paymentId = Number(id)
  if (Number.isNaN(paymentId)) {
    console.error('Invalid payment id')
    return null
  }
  const res = await db.select().from(payments).where(eq(payments.id, paymentId))
  return res?.[0]
}

export default async function EditPaymentModal({
  params,
  searchParams
}: {
  params: { paymentId: string }
  searchParams: { [key: string]: string }
}) {
  const { paymentId } = params
  const headersList = headers()
  const pathName = headersList.get('x-current-path') || ''
  const [paymentEditData, users, sessions] = await Promise.all([
    fetchPaymentById(paymentId),
    fetchUsers(),
    getSession()
  ])
  const { id: loginUserId } = sessions || {}

  const handleSubmit = async (formData: FormData) => {
    'use server'

    const validation = formValidation.safeParse({
      amount: Number(formData.get('amount')),
      paid_by: Number(formData.get('paid-by')),
      paid_to: Number(formData.get('paid-to')),
      note: formData.get('note') as string,
      updated_by: Number(loginUserId)
    })

    if (!validation.success) {
      console.error(validation.error)
      redirect('/payments/create?error=validation')
    }

    await db
      .update(payments)
      .set({
        amount: validation.data.amount,
        paid_by: validation.data.paid_by,
        paid_to: validation.data.paid_to,
        note: validation.data.note,
        updated_by: validation.data.updated_by
      })
      .where(eq(payments.id, Number(paymentId)))

    await db.insert(PaymentsLog).values({
      ...validation.data,
      type: 'edit',
      created_by: Number(loginUserId),
      payment_id: Number(paymentId)
    })

    revalidatePath('/payments')
    permanentRedirect('/payments')
  }

  return (
    <DialogClient open={pathName.includes('/payments/edit')} to="/payments">
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Payment</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Amount
              </Label>
              <Input
                id="name"
                name="amount"
                defaultValue={paymentEditData?.amount}
                type="number"
                className="col-span-3 w-64"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="paid-by" className="text-right">
                Paid by
              </Label>
              <Select name="paid-by" defaultValue={paymentEditData?.paid_by.toString()}>
                <SelectTrigger id="paid-by" className="w-64">
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Users</SelectLabel>
                    {users?.map(user => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="paid-to" className="text-right">
                Paid to
              </Label>
              <Select name="paid-to" defaultValue={paymentEditData?.paid_to.toString()}>
                <SelectTrigger id="paid-to" className="w-64">
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Users</SelectLabel>
                    {users?.map(user => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="note" className="text-right">
                Note
              </Label>
              <Textarea
                id="note"
                name="note"
                className=" h-10 w-64"
                defaultValue={paymentEditData?.note?.toString()}
              />
            </div>
          </div>

          {searchParams?.error && (
            <div className="mb-2 ml-24 w-64 rounded-md bg-red-100 p-2 text-red-950">
              Validation error
            </div>
          )}

          {searchParams?.success && (
            <div className="mb-2 ml-24 w-64 rounded-md bg-green-100 p-2 text-green-950">
              Payment edited successfully
            </div>
          )}

          <DialogFooter className="flex w-full flex-row items-stretch gap-2 pt-16">
            <BackBtnClient className="w-full" type="button" variant="outline">
              Cancel
            </BackBtnClient>
            <Button className="w-full" type="submit">
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </DialogClient>
  )
}
