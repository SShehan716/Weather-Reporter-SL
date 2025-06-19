/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
*/

-- First, add the column as nullable
ALTER TABLE "User" ADD COLUMN "username" TEXT;

-- Update existing records with a default username based on email
UPDATE "User" 
SET "username" = CONCAT('user_', SUBSTRING(email FROM 1 FOR POSITION('@' IN email) - 1), '_', id)
WHERE "username" IS NULL;

-- Make the column NOT NULL after updating existing records
ALTER TABLE "User" ALTER COLUMN "username" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
