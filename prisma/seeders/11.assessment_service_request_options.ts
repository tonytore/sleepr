import { Logger } from '@nestjs/common';

import type { PrismaClient } from '@prisma/client';

const logger = new Logger('AssessmentServiceRequestOptionSeeder');

/**
 * assessmentServiceRequestOptions
 * @description This array contains the assessment service request options to be seeded.
 */
const assessmentServiceRequestOptions = [
  {
    name: 'Promotion',
    description: 'Promotion assessment service request option',
  },
  {
    name: 'Transfer',
    description: 'Transfer assessment service request option',
  },
  {
    name: 'Scale',
    description: 'Scale assessment service request option',
  },
  {
    name: 'Career',
    description: 'Career assessment service request option',
  },
  {
    name: 'Transition',
    description: 'Transition assessment service request option',
  },
];

/**
 * seedAssessmentServiceRequestOptions
 * @description This function is used to seed the assessment service request options.
 * @param db The database service.
 */
export async function seedAssessmentServiceRequestOptions(db: PrismaClient) {
  console.log('Seeding assessment service request options...');
  const startTime = Date.now();

  try {
    for (const option of assessmentServiceRequestOptions) {
      const result = await db.assessmentServiceRequestOption.upsert({
        where: {
          name: option.name,
        },
        update: option,
        create: option,
      });
      console.log(`Assessment service request option created: ${result.name}`);
    }

    logger.log(
      `*********** Assessment service request options seeding completed in ${Date.now() - startTime}ms! ***********`,
    );
  } catch (error) {
    logger.error('Error seeding assessment service request options:', error);
    throw error;
  }
}
