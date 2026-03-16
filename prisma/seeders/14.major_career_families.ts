import { Logger } from '@nestjs/common';

import type { PrismaClient } from '@prisma/client';

const logger = new Logger('MajorCareerFamilySeeder');

/**
 * majorCareerFamilies
 * @description This array contains the major career families to be seeded.
 */
const majorCareerFamilies = [
  {
    name: 'የጽሕፈት፣ የንብረት አስተዳደር፣ የጠቅላላ አገልግሎት እና ተዛማጅ የሙያ ዘርፍ',
    code: '01',
  },
  {
    name: 'የፋይናንስ፣ የኦዲት እና ተዛማጅ የሙያ ዘርፍ',
    code: '02',
  },
];

/**
 * seedMajorCareerFamilies
 * @description This function is used to seed the major career families.
 * @param db The database service.
 */
export async function seedMajorCareerFamilies(db: PrismaClient) {
  console.log('Seeding major career families...');
  const startTime = Date.now();

  try {
    for (const majorCareerFamily of majorCareerFamilies) {
      const result = await db.majorCareerFamily.upsert({
        where: {
          name: majorCareerFamily.name,
        },
        update: majorCareerFamily,
        create: majorCareerFamily,
      });
      console.log(`Major career family created: ${result.name}`);
    }

    logger.log(
      `*********** Major career families seeding completed in ${Date.now() - startTime}ms! ***********`,
    );
  } catch (error) {
    logger.error('Error seeding major career families:', error);
    throw error;
  }
}
