ALTER TABLE "links" RENAME COLUMN "url" TO "original_url";--> statement-breakpoint
ALTER TABLE "links" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "links" DROP COLUMN "clerk_user_id";--> statement-breakpoint
ALTER TABLE "links" ALTER COLUMN "id" SET DATA TYPE integer USING "id"::integer;--> statement-breakpoint
ALTER TABLE "links" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "links" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (sequence name "links_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1);