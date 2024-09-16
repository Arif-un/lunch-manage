import { ChevronLeftIcon, Pencil1Icon } from '@radix-ui/react-icons'
import { desc, eq, sql } from 'drizzle-orm'
import Link from 'next/link'

import ContentWrapper from '@/src/components/content-wrapper'
import DateFromTo from '@/src/components/date-from-to'
import ItemPerPage from '@/src/components/item-per-page'
import NavButton from '@/src/components/nav-button'
import { Pagination } from '@/src/components/pagination'
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

const DEFAULT_ITEMS_PER_PAGE = 20

async function fetchPaymentsByUser(userId: number, page: number, itemsPerPage: number) {
  const offset = (page - 1) * itemsPerPage

  const [payments, totalCount, totalAmount] = await Promise.all([
    db
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
      .limit(itemsPerPage)
      .offset(offset)
      .execute(),
    db
      .select({ count: sql`count(*)` })
      .from(Payments)
      .where(eq(Payments.paid_by, userId))
      .execute()
      .then(result => result[0].count as number),
    db
      .select({ total: sql`SUM(amount)` })
      .from(Payments)
      .where(eq(Payments.paid_by, userId))
      .execute()
      .then(result => result[0].total as number)
  ])

  return { payments, totalCount, totalAmount }
}

export default async function PaymentsOfUserPage({
  params: { userId },
  searchParams
}: {
  params: { userId: string }
  searchParams: { page?: string; item?: string }
}) {
  const pageNum = Number(searchParams.page) || 1
  const itemsPerPage = Number(searchParams.item) || DEFAULT_ITEMS_PER_PAGE

  const {
    payments: fetchedPayments,
    totalCount,
    totalAmount
  } = await fetchPaymentsByUser(Number(userId), pageNum, itemsPerPage)
  const userName = fetchedPayments?.[0]?.paid_by_name || ''
  const totalPages = Math.ceil(totalCount / itemsPerPage)

  return (
    <ContentWrapper>
      <main className="flex min-h-screen flex-col items-center bg-slate-100">
        <div className="w-10/12 md:w-3/6 ">
          <div className="my-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <NavButton />
              <h2 className="font-semibold ">Payments of {userName as string}</h2>
            </div>
            <DateFromTo />
          </div>

          <Button asChild variant="link" className="p-0 text-slate-500">
            <Link href="/payments">
              <ChevronLeftIcon />
              Back to all payments
            </Link>
          </Button>

          <div className="mb-4 flex items-center justify-between">
            <div className="flex gap-1">
              <h3 className="text-slate-500">Total Amount Paid:</h3> ৳ {totalAmount}
            </div>
3
            <ItemPerPage />
          </div>

          {!fetchedPayments.length && <div className="text-slate-500">No payments data found</div>}

          <Accordion type="single" collapsible className="w-full">
            {fetchedPayments?.map(payment => (
              <AccordionItem key={payment.id} value={payment.id.toString()} className="">
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
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <Pagination
            currentPage={pageNum}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            baseUrl={`/payments/user/${userId}`}
          />
        </div>
      </main>
    </ContentWrapper>
  )
}
