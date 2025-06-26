-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastResetEmailSent" TIMESTAMP(3),
ADD COLUMN     "lastVerificationEmailSent" TIMESTAMP(3);
