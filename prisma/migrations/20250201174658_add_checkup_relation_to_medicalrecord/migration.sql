/*
  Warnings:

  - Added the required column `checkupId` to the `MedicalRecord` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `MedicalRecord` ADD COLUMN `checkupId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `MedicalRecord` ADD CONSTRAINT `MedicalRecord_checkupId_fkey` FOREIGN KEY (`checkupId`) REFERENCES `Checkup`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
