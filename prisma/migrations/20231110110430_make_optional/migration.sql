-- AlterTable
ALTER TABLE "Form" ALTER COLUMN "endingDescription" SET DEFAULT 'We have received your response and will process it shortly.',
ALTER COLUMN "endingTitle" DROP NOT NULL,
ALTER COLUMN "endingTitle" SET DEFAULT 'Thank you for your submission!';
