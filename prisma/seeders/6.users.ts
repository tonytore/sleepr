import { Logger } from '@nestjs/common';
import { Gender, type PrismaClient } from '@prisma/client';
import { hash } from 'argon2';

/**
 * Password for all users.
 */
const PASSWORD = 'StrongPassword@123'; // NOSONAR
/**
 * List of users to be seeded.
 */
const users = [
  {
    roles: ['super-admin'],
    firstName: 'Super',
    middleName: 'Admin',
    lastName: 'Admin',
    email: 'admin@gmail.com',
    phoneNumber: '0911111110',
    dob: new Date('1990-01-01'),
    gender: Gender.male,
  },
  {
    roles: ['cas'],
    firstName: 'Competency',
    middleName: 'Assessment',
    lastName: 'Service',
    email: 'cas@gmail.com',
    phoneNumber: '0911111111',
    dob: new Date('1990-01-01'),
    gender: Gender.male,
  },
  {
    roles: ['regulatory'],
    firstName: 'Regulatory',
    middleName: 'Body',
    lastName: 'Admin',
    email: 'regulatory@gmail.com',
    phoneNumber: '0911111112',
    dob: new Date('1990-01-01'),
    gender: Gender.female,
  },
  {
    roles: ['operational'],
    firstName: 'Operational',
    middleName: 'Staff',
    lastName: 'Admin',
    email: 'operational@gmail.com',
    phoneNumber: '0911111113',
    dob: new Date('1990-01-01'),
    gender: Gender.male,
  },
  {
    roles: ['agency'],
    firstName: 'Agency',
    middleName: 'Admin',
    lastName: 'Admin',
    email: 'agency@gmail.com',
    phoneNumber: '0911111114',
    dob: new Date('1990-01-01'),
    gender: Gender.male,
  },
  {
    roles: ['third-party'],
    firstName: 'Third',
    middleName: 'Party',
    lastName: 'Admin',
    email: 'third-party@gmail.com',
    phoneNumber: '0911111115',
    dob: new Date('1990-01-01'),
    gender: Gender.male,
  },
  {
    roles: ['candidate'],
    firstName: 'Candidate',
    middleName: 'Admin',
    lastName: 'Admin',
    email: 'candidate@gmail.com',
    phoneNumber: '0911111116',
    dob: new Date('1990-01-01'),
    gender: Gender.male,
  },
  {
    roles: ['question-admin'],
    firstName: 'Question',
    middleName: 'Admin',
    lastName: 'Admin',
    email: 'question-admin@gmail.com',
    phoneNumber: '0911111117',
    dob: new Date('1990-01-01'),
    gender: Gender.male,
  },
  {
    roles: ['question-inserter'],
    firstName: 'Question',
    middleName: 'Inserter',
    lastName: 'Admin',
    email: 'question-inserter@gmail.com',
    phoneNumber: '0911111118',
    dob: new Date('1990-01-01'),
    gender: Gender.male,
  },
  {
    roles: ['question-reviewer'],
    firstName: 'Question',
    middleName: 'Reviewer',
    lastName: 'Admin',
    email: 'question-reviewer@gmail.com',
    phoneNumber: '0911111119',
    dob: new Date('1990-01-01'),
    gender: Gender.male,
  },
];

/**
 * Seeds users into the database.
 * @param db - The database service.
 */
export async function seedUsers(db: PrismaClient) {
  console.log('Seeding users...');
  const startTime = Date.now();
  const password = await hash(PASSWORD);

  try {
    for (const user of users) {
      const { roles, ...rest } = user;
      const result = await db.user.upsert({
        where: {
          email: user.email,
        },
        update: {
          ...rest,
          password,
        },
        create: {
          ...rest,
          password,
        },
      });

      await db.userRole.deleteMany({
        where: {
          userId: result.id,
        },
      });

      for (const role of roles) {
        const dbRole = await db.role.findUnique({
          where: {
            name: role,
          },
        });
        if (!dbRole) {
          console.log(`Role ${role} not found`);
          throw new Error(`Role ${role} not found`);
        }
        await db.userRole.create({
          data: {
            userId: result.id,
            roleId: dbRole.id,
          },
        });
      }
      console.log(`User created: ${result.email}`);
    }

    Logger.log(
      `*********** Users seeding completed in ${
        Date.now() - startTime
      }ms! ***********`,
    );
  } catch (error) {
    Logger.error('Error seeding users:', error);
    throw error;
  }
}
