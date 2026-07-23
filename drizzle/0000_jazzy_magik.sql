CREATE TYPE "public"."lead_course_type" AS ENUM('category', 'express');--> statement-breakpoint
CREATE TYPE "public"."lead_status" AS ENUM('new', 'contacted', 'registered', 'lost', 'enrolled');--> statement-breakpoint
CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"phone" varchar(13) NOT NULL,
	"course_type" "lead_course_type" NOT NULL,
	"course_slug" varchar(30),
	"branch_slug" varchar(50),
	"locale" varchar(2) NOT NULL,
	"source_page" text NOT NULL,
	"status" "lead_status" DEFAULT 'new' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "leads_status_idx" ON "leads" USING btree ("status");--> statement-breakpoint
CREATE INDEX "leads_created_at_idx" ON "leads" USING btree ("created_at");