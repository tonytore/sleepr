import { Logger } from '@nestjs/common';

import type { PrismaClient } from '@prisma/client';

const logger = new Logger('SubMajorCareerFamilySeeder');

/**
 * subMajorCareerFamilies
 * @description This array contains the sub major career families to be seeded.
 */
const subMajorCareerFamilies = [
  {
    majorCareerFamilyCode: '01',
    name: 'የጽሕፈት፣ የክለሪካል እና ተዛማጅ ሥራዎች',
    code: '0101',
  },
  {
    majorCareerFamilyCode: '02',
    name: 'የፋይናንስ፣ የኦዲት እና ተዛማጅ የሙያ ዘርፍ',
    code: '0201',
  },
];

/**
 * seedSubMajorCareerFamilies
 * @description This function is used to seed the sub major career families.
 * @param db The database service.
 */
export async function seedSubMajorCareerFamilies(db: PrismaClient) {
  console.log('Seeding sub major career families...');
  const startTime = Date.now();

  try {
    for (const family of subMajorCareerFamilies) {
      const majorCareerFamily = await db.majorCareerFamily.findUnique({
        where: {
          code: family.majorCareerFamilyCode,
        },
      });
      if (!majorCareerFamily) {
        throw new Error(
          `Major career family not found: ${family.majorCareerFamilyCode}`,
        );
      }
      const result = await db.subMajorCareerFamily.upsert({
        where: {
          name: family.name,
        },
        update: {
          name: family.name,
          code: family.code,
          majorCareerFamilyId: majorCareerFamily.id,
        },
        create: {
          name: family.name,
          code: family.code,
          majorCareerFamilyId: majorCareerFamily.id,
        },
      });
      console.log(`Sub major career family created: ${result.name}`);
    }

    logger.log(
      `*********** Sub major career families seeding completed in ${
        Date.now() - startTime
      }ms! ***********`,
    );
  } catch (error) {
    logger.error('Error seeding sub major career families:', error);
    throw error;
  }
}
