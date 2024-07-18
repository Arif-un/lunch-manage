CREATE TABLE `payments` (
	`id` integer PRIMARY KEY NOT NULL,
	`amount` integer DEFAULT 0 NOT NULL,
	`paid_by` integer NOT NULL,
	`paid_to` integer NOT NULL,
	`note` text DEFAULT '',
	`created_by` integer NOT NULL,
	`updated_by` integer NOT NULL,
	`created_at` integer,
	`updated_at` integer DEFAULT (DATETIME('now', 'localtime')),
	FOREIGN KEY (`paid_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`paid_to`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `payments_log` (
	`id` integer PRIMARY KEY NOT NULL,
	`payment_id` integer NOT NULL,
	`type` text NOT NULL,
	`amount` integer DEFAULT 0 NOT NULL,
	`paid_by` integer NOT NULL,
	`paid_to` integer NOT NULL,
	`note` text DEFAULT '',
	`created_by` integer NOT NULL,
	`updated_by` integer NOT NULL,
	`created_at` integer DEFAULT (DATETIME('now', 'localtime')),
	FOREIGN KEY (`payment_id`) REFERENCES `payments`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`paid_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`paid_to`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`balance` integer DEFAULT 0,
	`status` text DEFAULT 'active',
	`created_at` integer,
	`updated_at` integer DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);