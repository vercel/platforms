-- AlterTable
ALTER TABLE `Post` MODIFY `description` TEXT NULL,
    MODIFY `content` LONGTEXT NULL,
    MODIFY `image` TEXT NULL,
    MODIFY `imageBlurhash` LONGTEXT NULL;

-- AlterTable
ALTER TABLE `Site` MODIFY `description` TEXT NULL,
    MODIFY `image` TEXT NULL,
    MODIFY `imageBlurhash` LONGTEXT NULL;
