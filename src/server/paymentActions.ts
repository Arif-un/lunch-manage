'use server'

import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

import { getSession } from '@/src/lib/auth'
import db from '@/src/lib/db/connection'
import { beforePaymentDelete } from '@/src/lib/db/hooks/paymentHooks'
import Payments from '@/src/lib/db/schema/Payments'
import PaymentsLog from '@/src/lib/db/schema/PaymentsLog'

/**
 * Server action to delete a payment and log the deletion
 * @param paymentId Payment ID to delete
 */
export async function deletePaymentAction(paymentId: number) {
  const session = await getSession()
  const { id: loginUserId } = session || {}

  if (!loginUserId) {
    throw new Error('User must be logged in to delete a payment')
  }

  // First get the payment data so we can log it
  const payment = await db
    .select()
    .from(Payments)
    .where(eq(Payments.id, paymentId))
    .then(res => res[0])

  if (!payment) {
    throw new Error('Payment not found')
  }

  // Log the deletion before deleting the payment
  await beforePaymentDelete(paymentId, {
    amount: payment.amount,
    paid_by: payment.paid_by,
    paid_to: payment.paid_to,
    note: payment.note,
    created_by: payment.created_by,
    updated_by: Number(loginUserId) // Use the current user as the updater
  })

  try {
    // First delete all related payment logs to avoid foreign key constraint errors
    await db.delete(PaymentsLog).where(eq(PaymentsLog.payment_id, paymentId))

    // Then delete the payment itself
    await db.delete(Payments).where(eq(Payments.id, paymentId))

    // Revalidate related paths
    revalidatePath('/payments')
    revalidatePath(`/payments/user/${payment.paid_by}`)

    return { success: true }
  } catch (error) {
    console.error('Error deleting payment:', error)
    throw new Error('Failed to delete payment')
  }
}
