-- CreateTable
CREATE TABLE `admin` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `fname` VARCHAR(255) NOT NULL,
    `lastname` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `username` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `registered_at` DATE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `choice` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `value` VARCHAR(100) NOT NULL,
    `question_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `question` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `quiz_id` INTEGER NOT NULL,
    `content` VARCHAR(255) NOT NULL,
    `language` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `quiz` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `number_of_questions` INTEGER NOT NULL,
    `views` BIGINT NOT NULL,
    `tag` VARCHAR(255) NOT NULL,
    `created_at` DATE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `scoreboard` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `point` INTEGER NOT NULL,
    `quiz_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usedtime` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `question_id` INTEGER NOT NULL,
    `time` DATE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `telegram_id` BIGINT NOT NULL,
    `username` VARCHAR(255) NOT NULL,
    `number_of_quiz` INTEGER NOT NULL,
    `number_of_shared_link` INTEGER NOT NULL,
    `isActive` TINYINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `choice` ADD CONSTRAINT `choice_question_id_foreign` FOREIGN KEY (`id`) REFERENCES `question`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `question` ADD CONSTRAINT `question_quiz_id_foreign` FOREIGN KEY (`id`) REFERENCES `quiz`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `scoreboard` ADD CONSTRAINT `scoreboard_quiz_id_foreign` FOREIGN KEY (`id`) REFERENCES `quiz`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `scoreboard` ADD CONSTRAINT `scoreboard_user_id_foreign` FOREIGN KEY (`id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `usedtime` ADD CONSTRAINT `usedtime_question_id_foreign` FOREIGN KEY (`id`) REFERENCES `question`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `usedtime` ADD CONSTRAINT `usedtime_user_id_foreign` FOREIGN KEY (`id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
