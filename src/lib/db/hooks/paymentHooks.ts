import { sql } from 'drizzle-orm'

import db from '../connection'
import PaymentsLog from '../schema/PaymentsLog'

/**
 * Log payment operations to the payments_log table
 * @param paymentId ID of the payment
 * @param data Payment data
 * @param operationType Type of operation (create, edit, delete)
 */
export async function logPaymentOperation(
  paymentId: number,
  data: {
    amount: number
    paid_by: number
    paid_to: number
    note?: string
    created_by: number
    updated_by: number
  },
  operationType: 'create' | 'edit' | 'delete'
) {
  try {
    await db.insert(PaymentsLog).values({
      payment_id: paymentId,
      type: operationType,
      amount: data.amount,
      paid_by: data.paid_by,
      paid_to: data.paid_to,
      note: data.note || '',
      created_by: data.created_by,
      updated_by: data.updated_by,
      created_at: sql`(DATETIME('now', 'localtime'))`
    })
    return true
  } catch (error) {
    console.error(`Error logging payment operation (${operationType}):`, error)
    return false
  }
}

/**
 * Automatically logs any payments after they are inserted into the Payments table
 * @param paymentId ID of the newly created payment
 * @param data Payment data that was inserted
 */
export async function afterPaymentInsert(
  paymentId: number,
  data: {
    amount: number
    paid_by: number
    paid_to: number
    note?: string
    created_by: number
    updated_by: number
  }
) {
  return logPaymentOperation(paymentId, data, 'create')
}

/**
 * Automatically logs any payments after they are updated in the Payments table
 * @param paymentId ID of the updated payment
 * @param data New payment data
 */
export async function afterPaymentUpdate(
  paymentId: number,
  data: {
    amount: number
    paid_by: number
    paid_to: number
    note?: string
    created_by: number
    updated_by: number
  }
) {
  return logPaymentOperation(paymentId, data, 'edit')
}

/**
 * Automatically logs any payments after they are deleted from the Payments table
 * @param paymentId ID of the deleted payment
 * @param data Payment data before deletion
 */
export async function beforePaymentDelete(
  paymentId: number,
  data: {
    amount: number
    paid_by: number
    paid_to: number
    note?: string
    created_by: number
    updated_by: number
  }
) {
  return logPaymentOperation(paymentId, data, 'delete')
}
