import { ChevronLeftIcon, Pencil1Icon } from '@radix-ui/react-icons'
import { desc, eq, sql } from 'drizzle-orm'
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
import Payments from '@/src/lib/db/schema/Payments'
import users from '@/src/lib/db/schema/Users'
import { dateToLocal } from '@/src/lib/utils'

async function fetchPaymentsByUser(userId: number) {
  return db
    .select({
      id: Payments.id,
      amount: Payments.amount,
      paid_by_id: Payments.paid_by,
      paid_by_name: sql`(SELECT name FROM ${users} WHERE id = ${Payments.paid_by})`.as('paid_by_name'),
      paid_to_id: Payments.paid_to,
      paid_to_name: sql`(SELECT name FROM ${users} WHERE id = ${Payments.paid_to})`.as('paid_to_name'),
      note: Payments.note,
      created_at: sql`DATETIME(${Payments.created_at}, 'auto')`.as('created_at'),
      updated_at: sql`DATETIME(${Payments.updated_at}, 'auto')`.as('updated_at'),
      created_by_id: Payments.created_by,
      created_by_name: sql`(SELECT name FROM ${users} WHERE id = ${Payments.created_by})`.as(
        'created_by_name'
      ),
      updated_by_id: Payments.updated_by,
      updated_by_name: sql`(SELECT name FROM ${users} WHERE id = ${Payments.updated_by})`.as(
        'updated_by_name'
      )
    })
    .from(Payments)
    .where(eq(Payments.paid_by, userId))
    .orderBy(desc(Payments.created_at))
    .execute()
}

export default async function PaymentsOfUserPage({ params: { userId } }: { params: { userId: 0 } }) {
  const fetchedPayments = await fetchPaymentsByUser(Number(userId))
  const userName = fetchedPayments?.[0]?.paid_by_name || ''
  return (
    <ContentWrapper>
      <main className="flex min-h-screen flex-col items-center bg-slate-100">
        <div className="w-10/12 md:w-3/6 ">
          <div className="my-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <NavButton />
              <h2 className="font-semibold ">Payments of {userName as string}</h2>
            </div>
          </div>

          {!fetchedPayments.length && <div className="text-slate-500">No payments data found</div>}

          <Button variant="link" className="p-0 text-slate-500">
            <ChevronLeftIcon />
            <Link href="/payments">Beck to all payments</Link>
          </Button>

          <Accordion type="single" collapsible className="w-full">
            {fetchedPayments?.map(payment => (
              <AccordionItem key={payment.id} value={payment.id.toString()}>
                <AccordionTrigger className="w-64 py-2">
                  <div className="mr-2 flex w-full items-center text-left">
                    <div className="flex w-full gap-0">
                      <span className="w-20 text-xs font-semibold">
                        {payment.paid_by_name as string}
                      </span>
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
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </main>
    </ContentWrapper>
  )
}
