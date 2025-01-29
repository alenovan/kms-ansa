-- AddForeignKey
ALTER TABLE `Checkup` ADD CONSTRAINT `Checkup_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `Member`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
