import { Logger } from '@nestjs/common';

import type { PrismaClient } from '@prisma/client';

const logger = new Logger('JobGradeSeeder');

/**
 * List of job grades to be seeded.
 */
const jobGrades = [
  {
    grade: 1,
    name: 'Level One',
    description: 'Basic understanding of the job',
  },
  {
    grade: 2,
    name: 'Level Two',
    description: 'Basic understanding of the job with some experience',
  },
  {
    grade: 3,
    name: 'Level Three',
    description: 'Basic understanding of the job with more experience',
  },
  {
    grade: 4,
    name: 'Level Four',
    description: 'Basic understanding of the job 2 years experience',
  },
  {
    grade: 5,
    name: 'Level Five',
    description: 'Basic understanding of the job 3 years experience',
  },
  {
    grade: 6,
    name: 'Level Six',
    description: 'Professional ability of the job 4 years experience',
  },
  {
    grade: 7,
    name: 'Level Seven',
    description: 'Professional ability of the job 5 years experience',
  },
  {
    grade: 8,
    name: 'Level Eight',
    description: 'Professional ability of the job 6 years experience',
  },
  {
    grade: 9,
    name: 'Level Nine',
    description: 'Professional ability of the job 7 years experience',
  },
  {
    grade: 10,
    name: 'Level Ten',
    description: 'Professional ability of the job 8 years experience',
  },
  {
    grade: 11,
    name: 'Level Eleven',
    description: 'Professional ability of the job 9 years experience',
  },
  {
    grade: 12,
    name: 'Level Twelve',
    description: 'Professional ability of the job 10 years experience',
  },
  {
    grade: 13,
    name: 'Level Thirteen',
    description: 'Professional ability of the job 11 years experience',
  },
  {
    grade: 14,
    name: 'Level Fourteen',
    description: 'Professional ability of the job 12 years experience',
  },
  {
    grade: 15,
    name: 'Level Fifteen',
    description: 'Professional ability of the job 13 years experience',
  },
  {
    grade: 16,
    name: 'Level Sixteen',
    description: 'Professional ability of the job 14 years experience',
  },
  {
    grade: 17,
    name: 'Level Seventeen',
    description: 'Professional ability of the job 15 years experience',
  },
  {
    grade: 18,
    name: 'Level Eighteen',
    description: 'Professional ability of the job 16 years experience',
  },
  {
    grade: 19,
    name: 'Level Nineteen',
    description: 'Professional ability of the job 17 years experience',
  },
  {
    grade: 20,
    name: 'Level Twenty',
    description: 'Professional ability of the job 18 years experience',
  },
  {
    grade: 21,
    name: 'Level Twenty One',
    description: 'Professional ability of the job 19 years experience',
  },
  {
    grade: 22,
    name: 'Level Twenty Two',
    description: 'Professional ability of the job 20 years experience',
  },
  {
    grade: 23,
    name: 'Level Twenty Three',
    description: 'Professional ability of the job 21 years experience',
  },
];

/**
 * Seeds job grades into the database.
 * @param db - The database service.
 */
export async function seedJobGrades(db: PrismaClient) {
  console.log('Seeding job grades...');
  const startTime = Date.now();

  try {
    for (const jobGrade of jobGrades) {
      const result = await db.jobGrade.upsert({
        where: {
          grade: jobGrade.grade,
        },
        update: jobGrade,
        create: jobGrade,
      });
      console.log(`Job grade created: ${result.name}`);
    }

    logger.log(
      `*********** Job grades seeding completed in ${
        Date.now() - startTime
      }ms! ***********`,
    );
  } catch (error) {
    logger.error('Error seeding job grades:', error);
    throw error;
  }
}
