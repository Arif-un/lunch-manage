import { Link2Icon, Pencil1Icon } from '@radix-ui/react-icons'
import { desc, sql } from 'drizzle-orm'
import Link from 'next/link'

import ContentWrapper from '@/src/components/content-wrapper'
import NavButton from '@/src/components/nav-button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/src/components/ui/accordion'
import { Button } from '@/src/components/ui/button'
import db from '@/src/lib/db/connection'
import payments from '@/src/lib/db/schema/Payments'
import users from '@/src/lib/db/schema/Users'
import { dateToLocal } from '@/src/lib/utils'

async function fetchPayments() {
  return db
    .select({
      id: payments.id,
      amount: payments.amount,
      paid_by_id: payments.paid_by,
      paid_by_name: sql`(SELECT name FROM ${users} WHERE id = ${payments.paid_by})`.as('paid_by_name'),
      paid_to_id: payments.paid_to,
      paid_to_name: sql`(SELECT name FROM ${users} WHERE id = ${payments.paid_to})`.as('paid_to_name'),
      note: payments.note,
      created_at: sql`DATETIME(${payments.created_at}, 'auto')`.as('created_at'),
      updated_at: sql`DATETIME(${payments.updated_at}, 'auto')`.as('updated_at'),
      created_by_id: payments.created_by,
      created_by_name: sql`(SELECT name FROM ${users} WHERE id = ${payments.created_by})`.as(
        'created_by_name'
      ),
      updated_by_id: payments.updated_by,
      updated_by_name: sql`(SELECT name FROM ${users} WHERE id = ${payments.updated_by})`.as(
        'updated_by_name'
      )
    })
    .from(payments)
    .orderBy(desc(payments.created_at))
    .execute()
}

export default async function PaymentsPage() {
  const fetchedPayments = await fetchPayments()

  return (
    <ContentWrapper>
      <main className="flex min-h-screen flex-col items-center bg-slate-100">
        <div className="w-10/12 md:w-3/6 ">
          <div className="my-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <NavButton />
              <h2 className="font-semibold ">Payments</h2>
            </div>
            <Button asChild className="rounded-full">
              <Link href="/payments/create">Add Payment</Link>
            </Button>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {fetchedPayments?.map(payment => (
              <AccordionItem key={payment.id} value={payment.id.toString()}>
                <AccordionTrigger className="w-64 py-2">
                  <div className="mr-2 flex w-full items-center text-left text-xs">
                    <div className="flex w-full gap-0">
                      <span className="w-20 font-semibold">{payment.paid_by_name as string}</span>
                      <span>৳ {payment.amount}</span>
                    </div>

                    <div className="flex w-80 items-center gap-1 text-right text-xs">
                      <span className="block w-36 text-xs text-slate-500">
                        {dateToLocal(payment.created_at as string)}
                      </span>
                      <Button asChild variant="ghost" size="icon">
                        <Link href={`/payments/edit/${payment.id}`}>
                          <Pencil1Icon />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="mb-1 grid grid-cols-1 justify-between rounded-sm bg-slate-50 p-2 text-xs md:grid-cols-2">
                  <div>
                    <div className="flex">
                      <div className="w-24 text-slate-500">Note:</div>
                      <div>{payment.note}</div>
                    </div>
                    <div className="flex">
                      <div className="w-24 text-slate-500">Received by:</div>
                      <div>{payment.paid_to_name as string}</div>
                    </div>
                  </div>
                  <div>
                    <div className="flex">
                      <div className="w-24 text-slate-500">Last updated:</div>
                      <div>{dateToLocal(payment.updated_at as string)}</div>
                    </div>
                    <div className="flex">
                      <div className="w-24 text-slate-500">Inserted at:</div>
                      <div>{dateToLocal(payment.created_at as string)}</div>
                    </div>
                  </div>
                  <div>
                    <Button variant="link" className="p-0 text-xs text-slate-500 underline">
                      <Link href={`/payments/user/${payment.paid_by_id}`} className="flex gap-1">
                        Payments by {payment.paid_by_name as string} <Link2Icon />
                      </Link>
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </main>
    </ContentWrapper>
  )
}
