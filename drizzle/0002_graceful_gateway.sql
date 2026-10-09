ALTER TABLE "categories" ALTER COLUMN "base_price" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "branches" ADD COLUMN "google_maps_url" text;