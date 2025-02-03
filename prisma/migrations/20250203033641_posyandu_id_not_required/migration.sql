-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_posyanduId_fkey`;

-- DropIndex
DROP INDEX `User_posyanduId_fkey` ON `User`;

-- AlterTable
ALTER TABLE `User` MODIFY `posyanduId` VARCHAR(191) NULL;
