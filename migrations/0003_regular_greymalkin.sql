CREATE TABLE `questions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`category_id` integer NOT NULL,
	`question_text` text NOT NULL,
	`options` blob NOT NULL,
	`correct_answer` text NOT NULL,
	`explanation` text,
	`difficulty` integer DEFAULT 1 NOT NULL,
	`metadata` blob,
	`isActive` integer DEFAULT true NOT NULL,
	`display_order` integer DEFAULT 0 NOT NULL,
	`createdAt` integer DEFAULT (CURRENT_TIMESTAMP),
	`updatedAt` integer DEFAULT (CURRENT_TIMESTAMP),
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action
);
