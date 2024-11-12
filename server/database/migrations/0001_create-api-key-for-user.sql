-- Migration number: 0001 	 2024-11-12T05:03:27.242Z
CREATE TABLE `userToken` (
	`id` integer PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`token` text NOT NULL,
	`enabled` integer DEFAULT 0 NOT NULL,
	`createDate` text NOT NULL,
	`deleteDate` text
);