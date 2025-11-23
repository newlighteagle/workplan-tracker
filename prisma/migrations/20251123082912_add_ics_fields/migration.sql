/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Ics` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `Ics` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ics" ADD COLUMN     "abbreviation" TEXT,
ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "fid" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Ics_code_key" ON "Ics"("code");
