import { Logger } from '@nestjs/common';

import type { PrismaClient } from '@prisma/client';

const logger = new Logger('CompetencyLevelSeeder');

const competencyLevels = [
  {
    jobCategory: 'Technician',
    jobLevel: 'Technician 1',
    description: 'Basic understanding of the job',
    grades: [1, 2, 3, 4],
  },
  {
    jobCategory: 'Technician',
    jobLevel: 'Technician 2',
    description: 'Basic understanding of the job',
    grades: [5, 6, 7, 8, 9],
  },
  {
    jobCategory: 'Technician',
    jobLevel: 'Technician 3',
    description:
      'Basic understanding of the job and can perform more complex tasks',
    grades: [8, 9, 10, 11, 12],
  },
  {
    jobCategory: 'Technician',
    jobLevel: 'Technician 4',
    description:
      'Basic understanding of the job and can perform more complex tasks',
    grades: [9, 10, 11, 12, 13],
  },
  {
    jobCategory: 'Professional',
    jobLevel: 'Professional 1',
    description:
      'Basic understanding of the job and can perform more complex tasks',
    grades: [8, 9, 10, 11, 12, 13, 14, 15],
  },
  {
    jobCategory: 'Professional',
    jobLevel: 'Professional 2',
    description:
      'Basic understanding of the job and can perform more complex tasks',
    grades: [10, 11, 12, 13, 14, 15, 16, 17],
  },
  {
    jobCategory: 'Professional',
    jobLevel: 'Professional 3',
    description:
      'Basic understanding of the job and can perform more complex tasks',
    grades: [18, 19, 20, 21, 22],
  },
  {
    jobCategory: 'Leadership',
    jobLevel: 'Leadership 1',
    description:
      'Basic understanding of the job and can perform more complex tasks',
    grades: [14, 15, 16, 17, 18],
  },
  {
    jobCategory: 'Leadership',
    jobLevel: 'Leadership 2',
    description:
      'Basic understanding of the job and can perform more complex tasks',
    grades: [18, 19, 20, 21],
  },
  {
    jobCategory: 'Leadership',
    jobLevel: 'Leadership 3',
    description:
      'Basic understanding of the job and can perform more complex tasks',
    grades: [20, 21, 22],
  },
];

/**
 * Seeds competency levels into the database.
 * @param db - The database service.
 */
export async function seedCompetencyLevels(db: PrismaClient) {
  console.log('Seeding competency levels...');
  const startTime = Date.now();

  try {
    for (const competencyLevel of competencyLevels) {
      const { jobCategory, jobLevel, description, grades } = competencyLevel;

      const dbJobCategory = await db.jobCategory.findUnique({
        where: {
          name: jobCategory,
        },
      });

      if (!dbJobCategory) {
        logger.error(`Job category not found: ${jobCategory}`);
        throw new Error(`Job category not found: ${jobCategory}`);
      }

      const jobGradeIds: string[] = [];

      for (const grade of grades) {
        const dbJobGrade = await db.jobGrade.findUnique({
          where: { grade },
        });

        if (!dbJobGrade) {
          logger.error(`Job grade not found: ${grade}`);
          throw new Error(`Job grade not found: ${grade}`);
        }

        jobGradeIds.push(dbJobGrade.id);
      }

      await db.competencyLevelJobGrade.deleteMany({
        where: {
          competencyLevelId: jobLevel,
        },
      });

      const result = await db.competencyLevel.upsert({
        where: { competencyLevel: jobLevel },
        update: {
          competencyLevel: jobLevel,
          description,
          jobCategory: {
            connect: {
              id: dbJobCategory.id,
            },
          },
          jobGrades: {
            createMany: {
              data: jobGradeIds.map((gradeId) => ({
                jobGradeId: gradeId,
              })),
            },
          },
        },
        create: {
          competencyLevel: jobLevel,
          description,
          jobCategory: {
            connect: {
              id: dbJobCategory.id,
            },
          },
          jobGrades: {
            createMany: {
              data: jobGradeIds.map((gradeId) => ({
                jobGradeId: gradeId,
              })),
            },
          },
        },
      });
      console.log(`Competency level created: ${result.competencyLevel}`);
    }

    logger.log(
      `*********** Competency levels seeding completed in ${
        Date.now() - startTime
      }ms! ***********`,
    );
  } catch (error) {
    logger.error('Error seeding competency levels:', error);
    throw error;
  }
}
