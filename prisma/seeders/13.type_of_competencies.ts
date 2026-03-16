import { Logger } from '@nestjs/common';

import type { PrismaClient } from '@prisma/client';

const logger = new Logger('TypeOfCompetencySeeder');

/**
 * typeOfCompetencies
 * @description This array contains the type of competencies to be seeded.
 */
const typeOfCompetencies = [
  {
    name: 'Behavioral',
    description:
      'This type of competency is related to the behavior of the individual.',
  },
  {
    name: 'Technical',
    description:
      'This type of competency is related to the technical skills of the individual.',
  },
  {
    name: 'Knowledge',
    description:
      'This type of competency is related to the knowledge of the individual.',
  },
];

/**
 * seedTypeOfCompetencies
 * @description This function is used to seed the type of competencies.
 * @param db The database service.
 */
export async function seedTypeOfCompetencies(db: PrismaClient) {
  console.log('Seeding type of competencies...');
  const startTime = Date.now();

  try {
    for (const typeOfCompetency of typeOfCompetencies) {
      const result = await db.typeOfCompetency.upsert({
        where: {
          name: typeOfCompetency.name,
        },
        update: typeOfCompetency,
        create: typeOfCompetency,
      });
      console.log(`Type of competency created: ${result.name}`);
    }

    logger.log(
      `*********** Type of competencies seeding completed in ${Date.now() - startTime}ms! ***********`,
    );
  } catch (error) {
    logger.error('Error seeding type of competencies:', error);
    throw error;
  }
}
