import { Logger } from '@nestjs/common';

import type { PrismaClient } from '@prisma/client';

const logger = new Logger('PriceTypeSeeder');

/**
 * priceTypes
 * @description This array contains the price types to be seeded.
 */
const priceTypes = [
  {
    name: 'Unit',
  },
  {
    name: 'Range',
  },
  {
    name: 'Package',
  },
];

/**
 * seedPriceTypes
 * @description This function is used to seed the price types.
 * @param db The database service.
 */
export async function seedPriceTypes(db: PrismaClient) {
  console.log('Seeding price types...');
  const startTime = Date.now();

  try {
    for (const priceType of priceTypes) {
      const result = await db.priceType.upsert({
        where: {
          name: priceType.name,
        },
        update: priceType,
        create: priceType,
      });
      console.log(`Price type created: ${result.name}`);
    }

    logger.log(
      `*********** Price types seeding completed in ${Date.now() - startTime}ms! ***********`,
    );
  } catch (error) {
    logger.error('Error seeding price types:', error);
    throw error;
  }
}
