-- CreateTable
CREATE TABLE `Example` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `description` TEXT NULL,
    `domainCount` INTEGER NULL,
    `url` VARCHAR(191) NULL,
    `image` TEXT NULL,
    `imageBlurhash` LONGTEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
