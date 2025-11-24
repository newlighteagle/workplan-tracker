-- CreateTable
CREATE TABLE "IcsDetail" (
    "id" SERIAL NOT NULL,
    "icsId" INTEGER NOT NULL,
    "description" TEXT,

    CONSTRAINT "IcsDetail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IcsDetail_icsId_key" ON "IcsDetail"("icsId");

-- AddForeignKey
ALTER TABLE "IcsDetail" ADD CONSTRAINT "IcsDetail_icsId_fkey" FOREIGN KEY ("icsId") REFERENCES "Ics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
