import { Logger } from '@nestjs/common';

import type { PrismaClient } from '@prisma/client';

const logger = new Logger('EducationalQualificationSeeder');

/**
 * educationalQualifications
 * @description This array contains the educational qualifications to be seeded.
 */
const educationalQualifications = [
  {
    name: 'Technical And Vocational Education And Training Level 1',
    description: 'Technical And Vocational Education And Training Level 1',
  },
  {
    name: 'Technical And Vocational Education And Training Level 2',
    description: 'Technical And Vocational Education And Training Level 2',
  },
  {
    name: 'Technical And Vocational Education And Training Level 3',
    description: 'Technical And Vocational Education And Training Level 3',
  },
  {
    name: 'Technical And Vocational Education And Training Level 4',
    description: 'Technical And Vocational Education And Training Level 4',
  },
  {
    name: 'Technical And Vocational Education And Training Level 5',
    description: 'Technical And Vocational Education And Training Level 5',
  },
  {
    name: 'First Degree',
    description: 'First Degree',
  },
  {
    name: 'Second Degree',
    description: 'Second Degree',
  },
  {
    name: 'Third Degree',
    description: 'Third Degree',
  },
];

/**
 * seedEducationalQualifications
 * @description This function is used to seed the educational qualifications.
 * @param db The database service.
 */
export async function seedEducationalQualifications(db: PrismaClient) {
  console.log('Seeding educational qualifications...');
  const startTime = Date.now();

  try {
    for (const qualification of educationalQualifications) {
      const result = await db.educationalQualification.upsert({
        where: {
          name: qualification.name,
        },
        update: qualification,
        create: qualification,
      });
      console.log(`Educational qualification created: ${result.name}`);
    }

    logger.log(
      `*********** Educational qualifications seeding completed in ${Date.now() - startTime}ms! ***********`,
    );
  } catch (error) {
    logger.error('Error seeding educational qualifications:', error);
    throw error;
  }
}
