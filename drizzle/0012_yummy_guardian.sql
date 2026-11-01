ALTER TABLE `habit` ADD `habitType` text DEFAULT 'yesNo' NOT NULL;--> statement-breakpoint
ALTER TABLE `habit` ADD `targetGoal` real DEFAULT 0 NOT NULL;