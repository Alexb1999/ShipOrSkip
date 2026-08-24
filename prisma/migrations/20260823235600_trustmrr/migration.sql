-- AlterTable
ALTER TABLE "App" ADD COLUMN "trustMrrSlug" TEXT;
ALTER TABLE "App" ADD COLUMN "trustMrrUrl" TEXT;
ALTER TABLE "App" ADD COLUMN "verifiedMrr" DECIMAL(10,2);
ALTER TABLE "App" ADD COLUMN "verifiedAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "App_trustMrrSlug_key" ON "App"("trustMrrSlug");
