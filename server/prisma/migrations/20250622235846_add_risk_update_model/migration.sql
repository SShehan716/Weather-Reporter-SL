-- CreateTable
CREATE TABLE "RiskUpdate" (
    "id" SERIAL NOT NULL,
    "locationName" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lon" DOUBLE PRECISION NOT NULL,
    "disasterType" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId" INTEGER NOT NULL,

    CONSTRAINT "RiskUpdate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RiskUpdate" ADD CONSTRAINT "RiskUpdate_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
