PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`isActive` integer DEFAULT true NOT NULL,
	`display_order` integer DEFAULT 0 NOT NULL,
	`createdAt` integer DEFAULT (CURRENT_TIMESTAMP),
	`updatedAt` integer DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
INSERT INTO `__new_categories`("id", "name", "slug", "description", "isActive", "display_order", "createdAt", "updatedAt") SELECT "id", "name", "slug", "description", "isActive", "display_order", "createdAt", "updatedAt" FROM `categories`;--> statement-breakpoint
DROP TABLE `categories`;--> statement-breakpoint
ALTER TABLE `__new_categories` RENAME TO `categories`;--> statement-breakpoint
PRAGMA foreign_keys=ON;