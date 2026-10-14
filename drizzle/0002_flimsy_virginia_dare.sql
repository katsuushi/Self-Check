PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_habit` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`color` text NOT NULL,
	`done` integer DEFAULT false NOT NULL,
	`lastCompleted` integer
);
--> statement-breakpoint
INSERT INTO `__new_habit`("id", "title", "description", "color", "done", "lastCompleted") SELECT "id", "title", "description", "color", "done", "lastCompleted" FROM `habit`;--> statement-breakpoint
DROP TABLE `habit`;--> statement-breakpoint
ALTER TABLE `__new_habit` RENAME TO `habit`;--> statement-breakpoint
PRAGMA foreign_keys=ON;