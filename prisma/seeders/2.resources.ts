import { Logger } from '@nestjs/common';
import { Resource } from 'src/common/auth/enums/resource.enum';

import type { PrismaClient } from '@prisma/client';

const logger = new Logger('ResourcesSeeder');

/**
 * resources
 * @description This array contains the resources to be seeded.
 */
const resources = [
  {
    name: Resource.Dashboard,
    description: 'Dashboard',
  },
  {
    name: Resource.JobGrade,
    description: 'Job Grade',
  },
  {
    name: Resource.JobCategory,
    description: 'Job Category',
  },
  {
    name: Resource.CompetencyLevel,
    description: 'Competency Level',
  },
  {
    name: Resource.RequestOptions,
    description: 'Request Options',
  },
  {
    name: Resource.EducationalQualification,
    description: 'Educational Qualification',
  },
  {
    name: Resource.MajorCareerFamily,
    description: 'Major Career Family',
  },
  {
    name: Resource.SubMajorCareerFamily,
    description: 'Sub Major Career Family',
  },
  {
    name: Resource.Professions,
    description: 'Professions',
  },
  {
    name: Resource.TypesOfCompetency,
    description: 'Types of Competency',
  },
  {
    name: Resource.LevelOfDifficulty,
    description: 'Level of Difficulty',
  },
  {
    name: Resource.User,
    description: 'User',
  },
  {
    name: Resource.Role,
    description: 'Role',
  },
  {
    name: Resource.Resource,
    description: 'Resource',
  },
  {
    name: Resource.Action,
    description: 'Action',
  },
  {
    name: Resource.Permission,
    description: 'Permission',
  },
  {
    name: Resource.AgreementTemplate,
    description: 'Agreement Template',
  },
  {
    name: Resource.QuestionBankManagement,
    description: 'Question Bank Management',
  },
  {
    name: Resource.Question,
    description: 'Question Management',
  },
  {
    name: Resource.Vacancy,
    description: 'Vacancy',
  },
  {
    name: Resource.AiAssistant,
    description: 'AI Assistant',
  },
  {
    name: Resource.AssessmentRequest,
    description: 'Assessment Request',
  },
  {
    name: Resource.CentralRecruitRequest,
    description: 'Central Recruit Request',
  },
  {
    name: Resource.CompetencyAssessment,
    description: 'Competency Assessment',
  },
  {
    name: Resource.Location,
    description: 'Location',
  },
];

/**
 * seedResources
 * @description This function is used to seed the resources.
 * @param db The database service.
 */
export async function seedResources(db: PrismaClient) {
  console.log('Seeding resources...');
  const startTime = Date.now();

  try {
    for (const resource of resources) {
      const result = await db.resource.upsert({
        where: {
          name: resource.name,
        },
        update: resource,
        create: resource,
      });
      console.log(`Resource created: ${result.name}`);
    }

    logger.log(
      `*********** Resources seeding completed in ${
        Date.now() - startTime
      }ms! ***********`,
    );
  } catch (error) {
    logger.error('Error seeding resources:', error);
    throw error;
  }
}
