-- AlterTable
ALTER TABLE `User` ADD COLUMN `puskesmasId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_posyanduId_fkey` FOREIGN KEY (`posyanduId`) REFERENCES `Posyandu`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_puskesmasId_fkey` FOREIGN KEY (`puskesmasId`) REFERENCES `Puskesmas`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
