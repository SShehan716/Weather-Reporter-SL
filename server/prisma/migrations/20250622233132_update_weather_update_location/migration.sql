/*
  Warnings:

  - You are about to drop the column `location` on the `WeatherUpdate` table. All the data in the column will be lost.
  - Added the required column `lat` to the `WeatherUpdate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locationName` to the `WeatherUpdate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lon` to the `WeatherUpdate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WeatherUpdate" DROP COLUMN "location",
ADD COLUMN     "lat" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "locationName" TEXT NOT NULL,
ADD COLUMN     "lon" DOUBLE PRECISION NOT NULL;
