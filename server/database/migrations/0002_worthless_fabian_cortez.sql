PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_images` (
	`key` text PRIMARY KEY NOT NULL,
	`tags` text DEFAULT '[]' NOT NULL,
	`favorite` integer DEFAULT false NOT NULL,
	`alive` integer DEFAULT true NOT NULL,
	`createDate` text NOT NULL,
	`deleteDate` text
);
--> statement-breakpoint
INSERT INTO `__new_images`("key", "tags", "favorite", "alive", "createDate", "deleteDate") SELECT "key", "tags", "favorite", "alive", "createDate", "deleteDate" FROM `images`;--> statement-breakpoint
DROP TABLE `images`;--> statement-breakpoint
UPDATE `__new_images` SET `tags` = '[1]' WHERE nsfw = 1;--> statement-breakpoint
UPDATE `__new_images` SET `tags` = '[]' WHERE nsfw = 0;--> statement-breakpoint
ALTER TABLE `__new_images` RENAME TO `images`;--> statement-breakpoint
PRAGMA foreign_keys=ON;
