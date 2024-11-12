-- Migration number: 0001 	 2024-11-12T07:59:22.036Z
CREATE TABLE [userToken] (
  "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  "userId" text NOT NULL,
  "token" text NOT NULL,
  "enabled" integer DEFAULT 0 NOT NULL,
  "createDate" text NOT NULL,
  "deleteDate" text
);