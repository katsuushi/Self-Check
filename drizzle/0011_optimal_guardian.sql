ALTER TABLE `habit` RENAME COLUMN "lastCompleted" TO "latestMark";--> statement-breakpoint
ALTER TABLE `habit` RENAME COLUMN "prevLastCompletion" TO "prevLatestMark";