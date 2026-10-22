PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_habit` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`color` text NOT NULL,
	`done` integer DEFAULT false NOT NULL,
	`lastCompleted` integer NOT NULL,
	`prevLastCompletion` integer NOT NULL,
	`streak` integer DEFAULT 0 NOT NULL,
	`createdAt` integer NOT NULL,
	`habitHistory` text DEFAULT '{}' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_habit`("id", "title", "description", "color", "done", "lastCompleted", "prevLastCompletion", "streak", "createdAt", "habitHistory") SELECT "id", "title", "description", "color", "done", "lastCompleted", COALESCE("prevLastCompletion", "lastCompleted"), "streak", "lastCompleted", "streakHistory" FROM `habit`;--> statement-breakpoint
DROP TABLE `habit`;--> statement-breakpoint
ALTER TABLE `__new_habit` RENAME TO `habit`;--> statement-breakpoint
PRAGMA foreign_keys=ON;
