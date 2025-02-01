-- AddForeignKey
ALTER TABLE `Puskesmas` ADD CONSTRAINT `Puskesmas_provinceId_fkey` FOREIGN KEY (`provinceId`) REFERENCES `Province`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Puskesmas` ADD CONSTRAINT `Puskesmas_cityId_fkey` FOREIGN KEY (`cityId`) REFERENCES `City`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Puskesmas` ADD CONSTRAINT `Puskesmas_subDistrictId_fkey` FOREIGN KEY (`subDistrictId`) REFERENCES `SubDistrict`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Puskesmas` ADD CONSTRAINT `Puskesmas_villageId_fkey` FOREIGN KEY (`villageId`) REFERENCES `Village`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Posyandu` ADD CONSTRAINT `Posyandu_puskesmasId_fkey` FOREIGN KEY (`puskesmasId`) REFERENCES `Puskesmas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
