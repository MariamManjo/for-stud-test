CREATE TABLE `place_catalog` (
	`id` text PRIMARY KEY NOT NULL,
	`content` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `trip_plans` (
	`user_id` text PRIMARY KEY NOT NULL,
	`state` text NOT NULL,
	`revision` integer DEFAULT 1 NOT NULL,
	`updated_at` text NOT NULL
);
