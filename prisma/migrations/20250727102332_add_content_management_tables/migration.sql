/*
  Warnings:

  - You are about to drop the column `credits` on the `ai_requests` table. All the data in the column will be lost.
  - You are about to drop the column `request` on the `ai_requests` table. All the data in the column will be lost.
  - You are about to drop the column `request_type` on the `ai_requests` table. All the data in the column will be lost.
  - You are about to drop the column `organic_sessions` on the `traffic_data` table. All the data in the column will be lost.
  - You are about to drop the column `total_sessions` on the `traffic_data` table. All the data in the column will be lost.
  - You are about to drop the column `total_users` on the `traffic_data` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[project_id,date,page]` on the table `content_performance` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[project_id,source,date,page]` on the table `traffic_data` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `parameters` to the `ai_requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `ai_requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `content_performance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `page` to the `content_performance` table without a default value. This is not possible if the table is not empty.
  - Made the column `source` on table `traffic_data` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('draft', 'published', 'scheduled', 'archived');

-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('post', 'page', 'landing_page', 'product');

-- CreateEnum
CREATE TYPE "ContentPriority" AS ENUM ('high', 'medium', 'low');

-- CreateEnum
CREATE TYPE "CalendarItemType" AS ENUM ('blog_post', 'social_media', 'email', 'landing_page', 'video', 'infographic');

-- CreateEnum
CREATE TYPE "CalendarItemStatus" AS ENUM ('planned', 'in_progress', 'review', 'published', 'archived');

-- DropIndex
DROP INDEX "content_performance_project_id_url_key";

-- DropIndex
DROP INDEX "traffic_data_project_id_date_source_medium_key";

-- AlterTable
ALTER TABLE "ai_requests" DROP COLUMN "credits",
DROP COLUMN "request",
DROP COLUMN "request_type",
ADD COLUMN     "completed_at" TIMESTAMP(3),
ADD COLUMN     "parameters" JSONB NOT NULL,
ADD COLUMN     "project_id" UUID,
ADD COLUMN     "type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "content_performance" ADD COLUMN     "clicks" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "ctr" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "date" DATE NOT NULL,
ADD COLUMN     "last_updated" TIMESTAMP(3),
ADD COLUMN     "page" TEXT NOT NULL,
ADD COLUMN     "position" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "word_count" INTEGER;

-- AlterTable
ALTER TABLE "reports" ADD COLUMN     "data" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "generated_at" TIMESTAMP(3),
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending',
ALTER COLUMN "config" SET DEFAULT '{}',
ALTER COLUMN "recipients" SET DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "traffic_data" DROP COLUMN "organic_sessions",
DROP COLUMN "total_sessions",
DROP COLUMN "total_users",
ADD COLUMN     "clicks" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "ctr" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "impressions" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "page" TEXT NOT NULL DEFAULT '/',
ADD COLUMN     "pageviews" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "position" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "query" TEXT,
ADD COLUMN     "sessions" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "users" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "avg_session_duration" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "source" SET NOT NULL,
ALTER COLUMN "source" SET DEFAULT 'direct';

-- CreateTable
CREATE TABLE "content" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'draft',
    "type" "ContentType" NOT NULL DEFAULT 'post',
    "categories" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "meta_title" TEXT,
    "meta_description" TEXT,
    "focus_keyword" TEXT,
    "seo_score" INTEGER,
    "readability_score" INTEGER,
    "published_at" TIMESTAMP(3),
    "featured_image" TEXT,
    "word_count" INTEGER NOT NULL DEFAULT 0,
    "reading_time" INTEGER NOT NULL DEFAULT 0,
    "project_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_categories" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "parent_id" UUID,
    "color" TEXT,
    "project_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "content_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_calendar_items" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "type" "CalendarItemType" NOT NULL,
    "status" "CalendarItemStatus" NOT NULL DEFAULT 'planned',
    "priority" "ContentPriority" NOT NULL DEFAULT 'medium',
    "publish_date" TIMESTAMP(3) NOT NULL,
    "target_keywords" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "estimated_word_count" INTEGER,
    "actual_word_count" INTEGER,
    "brief" TEXT NOT NULL,
    "notes" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "seo_score" INTEGER,
    "readability_score" INTEGER,
    "project_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "content_calendar_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_templates" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "template" TEXT NOT NULL,
    "variables" JSONB NOT NULL DEFAULT '[]',
    "seo_guidelines" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "word_count_range" JSONB,
    "project_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "content_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_comments" (
    "id" UUID NOT NULL,
    "content_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "parent_id" UUID,
    "comment" TEXT NOT NULL,
    "position" JSONB,
    "status" TEXT NOT NULL DEFAULT 'open',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "content_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_approvals" (
    "id" UUID NOT NULL,
    "content_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "status" TEXT NOT NULL,
    "feedback" TEXT,
    "approver_notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "content_approvals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "content_project_id_slug_key" ON "content"("project_id", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "content_categories_project_id_slug_key" ON "content_categories"("project_id", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "content_performance_project_id_date_page_key" ON "content_performance"("project_id", "date", "page");

-- CreateIndex
CREATE UNIQUE INDEX "traffic_data_project_id_source_date_page_key" ON "traffic_data"("project_id", "source", "date", "page");

-- AddForeignKey
ALTER TABLE "ai_requests" ADD CONSTRAINT "ai_requests_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content" ADD CONSTRAINT "content_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content" ADD CONSTRAINT "content_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_categories" ADD CONSTRAINT "content_categories_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_categories" ADD CONSTRAINT "content_categories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_categories" ADD CONSTRAINT "content_categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "content_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_calendar_items" ADD CONSTRAINT "content_calendar_items_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_calendar_items" ADD CONSTRAINT "content_calendar_items_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_templates" ADD CONSTRAINT "content_templates_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_templates" ADD CONSTRAINT "content_templates_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_comments" ADD CONSTRAINT "content_comments_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_comments" ADD CONSTRAINT "content_comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_comments" ADD CONSTRAINT "content_comments_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "content_comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_approvals" ADD CONSTRAINT "content_approvals_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_approvals" ADD CONSTRAINT "content_approvals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
