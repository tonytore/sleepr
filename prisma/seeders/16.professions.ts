import { Logger } from '@nestjs/common';

import type { PrismaClient } from '@prisma/client';

const logger = new Logger('ProfessionSeeder');

/**
 * professions
 * @description This array contains the professions to be seeded.
 */
const professions = [
  {
    subMajorCareerFamilyCode: '0101',
    code: '010101',
    name: 'የጽሕፈት፣ የክለሪካል እና ተዛማጅ ሥራዎች',
    level: 'VIII',
  },
  {
    subMajorCareerFamilyCode: '0201',
    code: '020102',
    name: 'የፋይናንስ፣ የኦዲት እና ተዛማጅ የሙያ ዘርፍ',
    level: 'X',
  },
];

/**
 * seedProfessions
 * @description This function is used to seed the professions.
 * @param db The database service.
 */
export async function seedProfessions(db: PrismaClient) {
  console.log('Seeding professions...');
  const startTime = Date.now();

  try {
    for (const profession of professions) {
      const subMajorCareerFamily = await db.subMajorCareerFamily.findUnique({
        where: {
          code: profession.subMajorCareerFamilyCode,
        },
      });
      if (!subMajorCareerFamily) {
        throw new Error(
          `Sub major career family not found: ${profession.subMajorCareerFamilyCode}`,
        );
      }
      const result = await db.profession.upsert({
        where: {
          name: profession.name,
        },
        update: {
          name: profession.name,
          code: profession.code,
          level: profession.level,
          subMajorCareerFamilyId: subMajorCareerFamily.id,
        },
        create: {
          name: profession.name,
          code: profession.code,
          level: profession.level,
          subMajorCareerFamilyId: subMajorCareerFamily.id,
        },
      });
      console.log(`Profession created: ${result.name}`);
    }

    logger.log(
      `*********** Professions seeding completed in ${Date.now() - startTime}ms! ***********`,
    );
  } catch (error) {
    logger.error('Error seeding professions:', error);
    throw error;
  }
}
