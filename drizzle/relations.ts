import { relations } from "drizzle-orm/relations";
import { users, meals, payments, payments_log, meals_log } from "./schema";

export const mealsRelations = relations(meals, ({one, many}) => ({
	user_updated_by: one(users, {
		fields: [meals.updated_by],
		references: [users.id],
		relationName: "meals_updated_by_users_id"
	}),
	user_created_by: one(users, {
		fields: [meals.created_by],
		references: [users.id],
		relationName: "meals_created_by_users_id"
	}),
	user_user_id: one(users, {
		fields: [meals.user_id],
		references: [users.id],
		relationName: "meals_user_id_users_id"
	}),
	meals_logs: many(meals_log),
}));

export const usersRelations = relations(users, ({many}) => ({
	meals_updated_by: many(meals, {
		relationName: "meals_updated_by_users_id"
	}),
	meals_created_by: many(meals, {
		relationName: "meals_created_by_users_id"
	}),
	meals_user_id: many(meals, {
		relationName: "meals_user_id_users_id"
	}),
	payments_updated_by: many(payments, {
		relationName: "payments_updated_by_users_id"
	}),
	payments_created_by: many(payments, {
		relationName: "payments_created_by_users_id"
	}),
	payments_paid_to: many(payments, {
		relationName: "payments_paid_to_users_id"
	}),
	payments_paid_by: many(payments, {
		relationName: "payments_paid_by_users_id"
	}),
	payments_logs_updated_by: many(payments_log, {
		relationName: "payments_log_updated_by_users_id"
	}),
	payments_logs_created_by: many(payments_log, {
		relationName: "payments_log_created_by_users_id"
	}),
	payments_logs_paid_to: many(payments_log, {
		relationName: "payments_log_paid_to_users_id"
	}),
	payments_logs_paid_by: many(payments_log, {
		relationName: "payments_log_paid_by_users_id"
	}),
	meals_logs_updated_by: many(meals_log, {
		relationName: "meals_log_updated_by_users_id"
	}),
	meals_logs_created_by: many(meals_log, {
		relationName: "meals_log_created_by_users_id"
	}),
	meals_logs_user_id: many(meals_log, {
		relationName: "meals_log_user_id_users_id"
	}),
}));

export const paymentsRelations = relations(payments, ({one, many}) => ({
	user_updated_by: one(users, {
		fields: [payments.updated_by],
		references: [users.id],
		relationName: "payments_updated_by_users_id"
	}),
	user_created_by: one(users, {
		fields: [payments.created_by],
		references: [users.id],
		relationName: "payments_created_by_users_id"
	}),
	user_paid_to: one(users, {
		fields: [payments.paid_to],
		references: [users.id],
		relationName: "payments_paid_to_users_id"
	}),
	user_paid_by: one(users, {
		fields: [payments.paid_by],
		references: [users.id],
		relationName: "payments_paid_by_users_id"
	}),
	payments_logs: many(payments_log),
}));

export const payments_logRelations = relations(payments_log, ({one}) => ({
	user_updated_by: one(users, {
		fields: [payments_log.updated_by],
		references: [users.id],
		relationName: "payments_log_updated_by_users_id"
	}),
	user_created_by: one(users, {
		fields: [payments_log.created_by],
		references: [users.id],
		relationName: "payments_log_created_by_users_id"
	}),
	user_paid_to: one(users, {
		fields: [payments_log.paid_to],
		references: [users.id],
		relationName: "payments_log_paid_to_users_id"
	}),
	user_paid_by: one(users, {
		fields: [payments_log.paid_by],
		references: [users.id],
		relationName: "payments_log_paid_by_users_id"
	}),
	payment: one(payments, {
		fields: [payments_log.payment_id],
		references: [payments.id]
	}),
}));

export const meals_logRelations = relations(meals_log, ({one}) => ({
	user_updated_by: one(users, {
		fields: [meals_log.updated_by],
		references: [users.id],
		relationName: "meals_log_updated_by_users_id"
	}),
	user_created_by: one(users, {
		fields: [meals_log.created_by],
		references: [users.id],
		relationName: "meals_log_created_by_users_id"
	}),
	user_user_id: one(users, {
		fields: [meals_log.user_id],
		references: [users.id],
		relationName: "meals_log_user_id_users_id"
	}),
	meal: one(meals, {
		fields: [meals_log.meal_id],
		references: [meals.id]
	}),
}));