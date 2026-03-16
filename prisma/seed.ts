import { Logger } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';
import { Pool } from 'pg';

import { seedRoles } from './seeders/1.roles';
import { seedPriceTypes } from './seeders/10.price_type';
import { seedAssessmentServiceRequestOptions } from './seeders/11.assessment_service_request_options';
import { seedEducationalQualifications } from './seeders/12.educational_qualifications';
import { seedTypeOfCompetencies } from './seeders/13.type_of_competencies';
import { seedMajorCareerFamilies } from './seeders/14.major_career_families';
import { seedSubMajorCareerFamilies } from './seeders/15.sub_major_career_families';
import { seedProfessions } from './seeders/16.professions';
import { seedLevelOfDifficulties } from './seeders/17.level_of_difficulties';
import { seedResources } from './seeders/2.resources';
import { seedActions } from './seeders/3.actions';
import { seedPermissions } from './seeders/4.permissions';
import { seedRolesPermissions } from './seeders/5.role_permissions';
import { seedUsers } from './seeders/6.users';
import { seedJobGrades } from './seeders/7.job_grade';
import { seedJobCategories } from './seeders/8.job_categories';
import { seedCompetencyLevels } from './seeders/9.competency_levels';

const logger = new Logger('Seeder');
const adapter = new PrismaPg(
  new Pool({ connectionString: process.env.DATABASE_URL }),
);
const prisma = new PrismaClient({ adapter });

/**
 * main
 * @description This function is used to run the seed function. It is the entry point of the seed script.
 */
async function main(): Promise<void> {
  const startTime = Date.now();

  try {
    logger.log('Seeding started...');
    await prisma.$connect();
    await seedRoles(prisma);
    await seedResources(prisma);
    await seedActions(prisma);
    await seedPermissions(prisma);
    await seedRolesPermissions(prisma);
    await seedUsers(prisma);
    await seedJobGrades(prisma);
    await seedJobCategories(prisma);
    await seedCompetencyLevels(prisma);
    await seedPriceTypes(prisma);
    await seedAssessmentServiceRequestOptions(prisma);
    await seedEducationalQualifications(prisma);
    await seedTypeOfCompetencies(prisma);
    await seedMajorCareerFamilies(prisma);
    await seedSubMajorCareerFamilies(prisma);
    await seedProfessions(prisma);
    await seedLevelOfDifficulties(prisma);
    logger.log(
      `*********** All seeds have been seeded successfully in ${Date.now() - startTime}ms! ***********`,
    );
  } catch (error) {
    logger.error('Error during seeding:', error);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect()); // NOSONAR
