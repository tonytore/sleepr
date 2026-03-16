import { Logger } from '@nestjs/common';

import type { PrismaClient } from '@prisma/client';

const logger = new Logger('LevelOfDifficultySeeder');

/**
 * levelOfDifficulties
 * @description This array contains the level of difficulties to be seeded.
 */
const levelOfDifficulties = [
  {
    name: 'Easy',
    description: 'Easy level of difficulty',
  },
  {
    name: 'Intermediate',
    description: 'Intermediate level of difficulty',
  },
  {
    name: 'Difficult',
    description: 'Difficult level of difficulty',
  },
];

/**
 * seedLevelOfDifficulties
 * @description This function is used to seed the level of difficulties.
 * @param db The database service.
 */
export async function seedLevelOfDifficulties(db: PrismaClient) {
  console.log('Seeding level of difficulties...');
  const startTime = Date.now();

  try {
    for (const levelOfDifficulty of levelOfDifficulties) {
      const result = await db.levelOfDifficulty.upsert({
        where: {
          name: levelOfDifficulty.name,
        },
        update: levelOfDifficulty,
        create: levelOfDifficulty,
      });
      console.log(`Level of difficulty created: ${result.name}`);
    }

    logger.log(
      `*********** Level of difficulties seeding completed in ${Date.now() - startTime}ms! ***********`,
    );
  } catch (error) {
    logger.error('Error seeding level of difficulties:', error);
    throw error;
  }
}
