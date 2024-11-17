CREATE TABLE `imagesToTags` (
	`imageKey` text NOT NULL,
	`tagId` integer NOT NULL,
	PRIMARY KEY(`imageKey`, `tagId`),
	FOREIGN KEY (`imageKey`) REFERENCES `images`(`key`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tagId`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE no action
);
INSERT INTO `imagesToTags` (`imageKey`, `tagId`) SELECT `key`, 1 FROM `images` WHERE `tags` = '[1]';--> statement-breakpoint
--> statement-breakpoint
ALTER TABLE `images` DROP COLUMN `tags`;