-- CreateTable
CREATE TABLE "UserMenu" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "menuId" INTEGER NOT NULL,
    "canCreate" BOOLEAN NOT NULL DEFAULT false,
    "canRead" BOOLEAN NOT NULL DEFAULT false,
    "canUpdate" BOOLEAN NOT NULL DEFAULT false,
    "canDelete" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserMenu_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserMenu_userId_menuId_key" ON "UserMenu"("userId", "menuId");

-- AddForeignKey
ALTER TABLE "UserMenu" ADD CONSTRAINT "UserMenu_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMenu" ADD CONSTRAINT "UserMenu_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menu"("id") ON DELETE CASCADE ON UPDATE CASCADE;
