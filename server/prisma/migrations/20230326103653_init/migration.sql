-- CreateTable
CREATE TABLE "FileSystem" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FileSystem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Directory" (
    "id" SERIAL NOT NULL,
    "file_system_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "permissions" INTEGER NOT NULL,
    "is_spawn_point" BOOLEAN NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "parent_dir_id" INTEGER,

    CONSTRAINT "Directory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "File" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "permissions" INTEGER NOT NULL,
    "directory_id" INTEGER NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Directory" ADD CONSTRAINT "Directory_file_system_id_fkey" FOREIGN KEY ("file_system_id") REFERENCES "FileSystem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Directory" ADD CONSTRAINT "Directory_parent_dir_id_fkey" FOREIGN KEY ("parent_dir_id") REFERENCES "Directory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_directory_id_fkey" FOREIGN KEY ("directory_id") REFERENCES "Directory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
