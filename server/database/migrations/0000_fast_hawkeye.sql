CREATE TABLE `images` (
	`key` text PRIMARY KEY NOT NULL,
	`nsfw` integer DEFAULT 0 NOT NULL,
	`favorite` integer DEFAULT 0 NOT NULL,
	`alive` integer DEFAULT 1 NOT NULL,
	`createDate` text NOT NULL,
	`deleteDate` text
);
