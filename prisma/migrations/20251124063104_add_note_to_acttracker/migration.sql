/*
  Warnings:

  - You are about to drop the column `outputId` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `activityId` on the `IcsActivity` table. All the data in the column will be lost.
  - You are about to drop the column `target` on the `Outcome` table. All the data in the column will be lost.
  - You are about to drop the column `outcomeId` on the `Output` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `Activity` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `Outcome` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `Output` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `Activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `outputCode` to the `Activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `activityCode` to the `IcsActivity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `Outcome` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `Output` table without a default value. This is not possible if the table is not empty.
  - Added the required column `outcomeCode` to the `Output` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_outputId_fkey";

-- DropForeignKey
ALTER TABLE "IcsActivity" DROP CONSTRAINT "IcsActivity_activityId_fkey";

-- DropForeignKey
ALTER TABLE "Output" DROP CONSTRAINT "Output_outcomeId_fkey";

-- AlterTable
ALTER TABLE "Activity" DROP COLUMN "outputId",
ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "outputCode" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'active';

-- AlterTable
ALTER TABLE "IcsActivity" DROP COLUMN "activityId",
ADD COLUMN     "activityCode" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Outcome" DROP COLUMN "target",
ADD COLUMN     "code" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Output" DROP COLUMN "outcomeId",
ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "outcomeCode" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "ActTracker" (
    "id" SERIAL NOT NULL,
    "actCode" TEXT NOT NULL,
    "actDesc" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "deadline" TEXT NOT NULL,
    "plan" BIGINT NOT NULL,
    "actual" BIGINT NOT NULL DEFAULT 0,
    "note" TEXT,

    CONSTRAINT "ActTracker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectPeriod" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL,
    "note" TEXT,

    CONSTRAINT "ProjectPeriod_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProjectPeriod_code_key" ON "ProjectPeriod"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Activity_code_key" ON "Activity"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Outcome_code_key" ON "Outcome"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Output_code_key" ON "Output"("code");

-- AddForeignKey
ALTER TABLE "Output" ADD CONSTRAINT "Output_outcomeCode_fkey" FOREIGN KEY ("outcomeCode") REFERENCES "Outcome"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_outputCode_fkey" FOREIGN KEY ("outputCode") REFERENCES "Output"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActTracker" ADD CONSTRAINT "ActTracker_actCode_fkey" FOREIGN KEY ("actCode") REFERENCES "Activity"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IcsActivity" ADD CONSTRAINT "IcsActivity_activityCode_fkey" FOREIGN KEY ("activityCode") REFERENCES "Activity"("code") ON DELETE CASCADE ON UPDATE CASCADE;
