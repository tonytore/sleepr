import { Logger } from '@nestjs/common';

import type { PrismaClient } from '@prisma/client';

const logger = new Logger('RolesSeeder');

/**
 * roles
 * @description This array contains the roles to be seeded.
 */
const roles = [
  {
    name: 'super-admin',
    displayName: 'Super Admin',
    description: 'This role is for super admin',
  },
  {
    name: 'cas',
    displayName: 'CAS',
    description: 'Centralized Admission System',
  },
  {
    name: 'regulatory',
    displayName: 'Regulatory',
    description: 'This role is for regulatory bodies',
  },
  {
    name: 'operational',
    displayName: 'Operational',
    description: 'This role is for operational staff',
  },
  {
    name: 'agency',
    displayName: 'Agency',
    description: 'This role is for agency that are working with us',
  },
  {
    name: 'third-party',
    displayName: 'Third Party',
    description: 'This role is for third party that are working with us',
  },
  {
    name: 'candidate',
    displayName: 'Candidate',
    description: 'This role is for candidate that are taking the exam',
  },
  {
    name: 'question-admin',
    displayName: 'Question Admin',
    description: 'This role is for question admin',
  },
  {
    name: 'question-inserter',
    displayName: 'Question Inserter',
    description: 'This role is for question inserter',
  },
  {
    name: 'question-reviewer',
    displayName: 'Question Reviewer',
    description: 'This role is for question reviewer',
  },
];

/**
 * seedRoles
 * @description This function is used to seed the roles.
 * @param db The database service.
 */
export async function seedRoles(db: PrismaClient) {
  console.log('Seeding roles...');
  const startTime = Date.now();

  try {
    for (const role of roles) {
      const result = await db.role.upsert({
        where: {
          name: role.name,
        },
        update: role,
        create: role,
      });
      console.log(`Role created: ${result.displayName}`);
    }

    logger.log(
      `*********** Roles seeding completed in ${
        Date.now() - startTime
      }ms! ***********`,
    );
  } catch (error) {
    logger.error('Error seeding roles:', error);
    throw error;
  }
}
