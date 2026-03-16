import { Logger } from '@nestjs/common';

import type { PrismaClient } from '@prisma/client';

const logger = new Logger('JobCategorySeeder');

const jobCategories = [
  {
    name: 'Technician',
    description: 'Technician roles',
  },
  {
    name: 'Professional',
    description: 'Professional roles',
  },
  {
    name: 'Leadership',
    description: 'Leadership roles',
  },
];

/**
 * Seeds job categories into the database.
 * @param db - The database service.
 */
export async function seedJobCategories(db: PrismaClient) {
  console.log('Seeding job categories...');
  const startTime = Date.now();

  try {
    for (const jobCategory of jobCategories) {
      const result = await db.jobCategory.upsert({
        where: {
          name: jobCategory.name,
        },
        update: jobCategory,
        create: jobCategory,
      });
      console.log(`Job category created: ${result.name}`);
    }

    logger.log(
      `*********** Job categories seeding completed in ${
        Date.now() - startTime
      }ms! ***********`,
    );
  } catch (error) {
    logger.error('Error seeding job categories:', error);
    throw error;
  }
}
