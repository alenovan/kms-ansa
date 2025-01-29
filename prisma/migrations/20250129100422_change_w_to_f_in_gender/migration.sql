/*
  Warnings:

  - The values [W] on the enum `Member_gender` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Member` MODIFY `gender` ENUM('M', 'F') NOT NULL DEFAULT 'M';
