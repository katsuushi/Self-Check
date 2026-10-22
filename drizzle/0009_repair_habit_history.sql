-- Repairs rows that were written by the original, broken 0008 migration.
-- SQLite treats unknown double-quoted identifiers as string literals, so the
-- previous INSERT ... SELECT stored 'createdAt' / 'habitHistory' as text.
-- Also normalizes old array-shaped history to the object map.
UPDATE `habit` SET `habitHistory` = '{}' WHERE `habitHistory` IN ('habitHistory', '[]', '[{}]');--> statement-breakpoint
UPDATE `habit` SET `createdAt` = `lastCompleted` WHERE typeof(`createdAt`) <> 'integer';
