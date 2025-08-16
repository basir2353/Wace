ALTER TABLE "videos" ALTER COLUMN "videoOrder" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "videos" ALTER COLUMN "videoOrder" DROP DEFAULT;