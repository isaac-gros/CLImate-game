/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Directory` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `File` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `FileSystem` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Directory" ALTER COLUMN "permissions" DROP NOT NULL,
ALTER COLUMN "permissions" SET DEFAULT 755,
ALTER COLUMN "is_spawn_point" SET DEFAULT false,
ALTER COLUMN "width" SET DEFAULT 3,
ALTER COLUMN "height" SET DEFAULT 3;

-- AlterTable
ALTER TABLE "File" ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "permissions" DROP NOT NULL,
ALTER COLUMN "permissions" SET DEFAULT 755;

-- CreateIndex
CREATE UNIQUE INDEX "Directory_id_key" ON "Directory"("id");

-- CreateIndex
CREATE UNIQUE INDEX "File_id_key" ON "File"("id");

-- CreateIndex
CREATE UNIQUE INDEX "FileSystem_id_key" ON "FileSystem"("id");
