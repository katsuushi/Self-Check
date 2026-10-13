CREATE TABLE `habit` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`done` integer DEFAULT false NOT NULL,
	`lastCompleted` integer
);
