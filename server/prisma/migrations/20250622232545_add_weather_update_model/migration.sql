-- CreateTable
CREATE TABLE "WeatherUpdate" (
    "id" SERIAL NOT NULL,
    "location" TEXT NOT NULL,
    "temperature" DOUBLE PRECISION NOT NULL,
    "conditions" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId" INTEGER NOT NULL,

    CONSTRAINT "WeatherUpdate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WeatherUpdate" ADD CONSTRAINT "WeatherUpdate_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
