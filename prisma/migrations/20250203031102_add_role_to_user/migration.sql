/*
  Warnings:

  - Made the column `posyanduId` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `roleId` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `posyanduId` VARCHAR(191) NOT NULL DEFAULT '';

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_posyanduId_fkey` FOREIGN KEY (`posyanduId`) REFERENCES `Posyandu`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
