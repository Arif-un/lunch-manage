import { sqliteTable, AnySQLiteColumn, integer, text, foreignKey, uniqueIndex } from "drizzle-orm/sqlite-core"
  import { sql } from "drizzle-orm"

export const meal_prices = sqliteTable("meal_prices", {
	id: integer("id").primaryKey().notNull(),
	label: text("label"),
	price: integer("price").default(0).notNull(),
	description: text("description"),
	is_default: integer("is_default"),
	created_at: integer("created_at"),
	updated_at: integer("updated_at").default(sql`(DATETIME('now', 'localtime'))`),
});

export const meals = sqliteTable("meals", {
	id: integer("id").primaryKey().notNull(),
	user_id: integer("user_id").notNull().references(() => users.id),
	quantity: integer("quantity").default(1).notNull(),
	amount: integer("amount").default(0).notNull(),
	note: text("note"),
	created_by: integer("created_by").notNull().references(() => users.id),
	updated_by: integer("updated_by").notNull().references(() => users.id),
	created_at: integer("created_at"),
	updated_at: integer("updated_at").default(sql`(DATETIME('now', 'localtime'))`),
});

export const payments = sqliteTable("payments", {
	id: integer("id").primaryKey().notNull(),
	amount: integer("amount").default(0).notNull(),
	paid_by: integer("paid_by").notNull().references(() => users.id),
	paid_to: integer("paid_to").notNull().references(() => users.id),
	note: text("note").default(""),
	created_by: integer("created_by").notNull().references(() => users.id),
	updated_by: integer("updated_by").notNull().references(() => users.id),
	created_at: integer("created_at"),
	updated_at: integer("updated_at").default(sql`(DATETIME('now', 'localtime'))`),
});

export const payments_log = sqliteTable("payments_log", {
	id: integer("id").primaryKey().notNull(),
	payment_id: integer("payment_id").notNull().references(() => payments.id),
	type: text("type").notNull(),
	amount: integer("amount").default(0).notNull(),
	paid_by: integer("paid_by").notNull().references(() => users.id),
	paid_to: integer("paid_to").notNull().references(() => users.id),
	note: text("note").default(""),
	created_by: integer("created_by").notNull().references(() => users.id),
	updated_by: integer("updated_by").notNull().references(() => users.id),
	created_at: integer("created_at").default(sql`(DATETIME('now', 'localtime'))`),
});

export const users = sqliteTable("users", {
	id: integer("id").primaryKey().notNull(),
	name: text("name").notNull(),
	email: text("email").notNull(),
	password: text("password").notNull(),
	balance: integer("balance").default(0),
	status: text("status").default("active"),
	created_at: integer("created_at"),
	updated_at: integer("updated_at").default(sql`(CURRENT_TIMESTAMP)`),
},
(table) => {
	return {
		email_unique: uniqueIndex("users_email_unique").on(table.email),
	}
});

export const meals_log = sqliteTable("meals_log", {
	id: integer("id").primaryKey().notNull(),
	text: text("text"),
	meal_id: integer("meal_id").notNull().references(() => meals.id),
	user_id: integer("user_id").notNull().references(() => users.id),
	quantity: integer("quantity").default(1).notNull(),
	amount: integer("amount").default(0).notNull(),
	note: text("note"),
	created_by: integer("created_by").notNull().references(() => users.id),
	updated_by: integer("updated_by").notNull().references(() => users.id),
	created_at: integer("created_at"),
	updated_at: integer("updated_at").default(sql`(DATETIME('now', 'localtime'))`),
});