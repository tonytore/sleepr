import { Logger } from '@nestjs/common';
import { Action } from 'src/common/auth/enums/action.enum';
import { Resource } from 'src/common/auth/enums/resource.enum';

import { permissions } from './4.permissions';

import type { PrismaClient } from '@prisma/client';

function getAllActions(resourceName: Resource): Action[] {
  const resource = permissions.find((p) => p.resource === resourceName);
  return resource ? resource.actions : [];
}

function getActionsExcept(
  resourceName: Resource,
  excludedActions: Action[],
): Action[] {
  const allActions = getAllActions(resourceName);
  return allActions.filter((action) => !excludedActions.includes(action));
}

const logger = new Logger('RolePermissionsSeeder');

/**
 * role_permissions
 * @description This array contains the role permissions to be seeded.
 */
const role_permissions = [
  {
    role: 'super-admin',
    resourcePermissions: [
      {
        resource: Resource.Dashboard,
        actions: getActionsExcept(Resource.Dashboard, [Action.ManageOwnData]),
      },
      {
        resource: Resource.JobGrade,
        actions: getAllActions(Resource.JobGrade),
      },
      {
        resource: Resource.JobCategory,
        actions: getAllActions(Resource.JobCategory),
      },
      {
        resource: Resource.CompetencyLevel,
        actions: getAllActions(Resource.CompetencyLevel),
      },
      {
        resource: Resource.RequestOptions,
        actions: getAllActions(Resource.RequestOptions),
      },
      {
        resource: Resource.EducationalQualification,
        actions: getAllActions(Resource.EducationalQualification),
      },
      {
        resource: Resource.MajorCareerFamily,
        actions: getAllActions(Resource.MajorCareerFamily),
      },
      {
        resource: Resource.SubMajorCareerFamily,
        actions: getAllActions(Resource.SubMajorCareerFamily),
      },
      {
        resource: Resource.Professions,
        actions: getAllActions(Resource.Professions),
      },
      {
        resource: Resource.TypesOfCompetency,
        actions: getAllActions(Resource.TypesOfCompetency),
      },
      {
        resource: Resource.LevelOfDifficulty,
        actions: getAllActions(Resource.LevelOfDifficulty),
      },
      {
        resource: Resource.User,
        actions: getAllActions(Resource.User),
      },
      {
        resource: Resource.Role,
        actions: getAllActions(Resource.Role),
      },
      {
        resource: Resource.Resource,
        actions: getAllActions(Resource.Resource),
      },
      {
        resource: Resource.Action,
        actions: getAllActions(Resource.Action),
      },
      {
        resource: Resource.Permission,
        actions: getAllActions(Resource.Permission),
      },
      {
        resource: Resource.AgreementTemplate,
        actions: getAllActions(Resource.AgreementTemplate),
      },
      {
        resource: Resource.QuestionBankManagement,
        actions: getAllActions(Resource.QuestionBankManagement),
      },
      {
        resource: Resource.Question,
        actions: getAllActions(Resource.Question),
      },
      {
        resource: Resource.Vacancy,
        actions: getAllActions(Resource.Vacancy),
      },
      {
        resource: Resource.AiAssistant,
        actions: getAllActions(Resource.AiAssistant),
      },
      {
        resource: Resource.AssessmentRequest,
        actions: getAllActions(Resource.AssessmentRequest),
      },
      {
        resource: Resource.CentralRecruitRequest,
        actions: getAllActions(Resource.CentralRecruitRequest),
      },
      {
        resource: Resource.CompetencyAssessment,
        actions: getAllActions(Resource.CompetencyAssessment),
      },
      {
        resource: Resource.Location,
        actions: getAllActions(Resource.Location),
      },
    ],
  },
  {
    role: 'cas',
    resourcePermissions: [
      {
        resource: Resource.Dashboard,
        actions: getActionsExcept(Resource.Dashboard, [Action.ManageOwnData]),
      },
      {
        resource: Resource.JobGrade,
        actions: getAllActions(Resource.JobGrade),
      },
      {
        resource: Resource.JobCategory,
        actions: getAllActions(Resource.JobCategory),
      },
      {
        resource: Resource.CompetencyLevel,
        actions: getAllActions(Resource.CompetencyLevel),
      },
      {
        resource: Resource.RequestOptions,
        actions: getAllActions(Resource.RequestOptions),
      },
      {
        resource: Resource.EducationalQualification,
        actions: getAllActions(Resource.EducationalQualification),
      },
      {
        resource: Resource.MajorCareerFamily,
        actions: getAllActions(Resource.MajorCareerFamily),
      },
      {
        resource: Resource.SubMajorCareerFamily,
        actions: getAllActions(Resource.SubMajorCareerFamily),
      },
      {
        resource: Resource.Professions,
        actions: getAllActions(Resource.Professions),
      },
      {
        resource: Resource.TypesOfCompetency,
        actions: getAllActions(Resource.TypesOfCompetency),
      },
      {
        resource: Resource.LevelOfDifficulty,
        actions: getAllActions(Resource.LevelOfDifficulty),
      },
      {
        resource: Resource.AgreementTemplate,
        actions: getAllActions(Resource.AgreementTemplate),
      },
      {
        resource: Resource.QuestionBankManagement,
        actions: getAllActions(Resource.QuestionBankManagement),
      },
      {
        resource: Resource.Question,
        actions: getAllActions(Resource.Question),
      },
      {
        resource: Resource.Vacancy,
        actions: getAllActions(Resource.Vacancy),
      },
      {
        resource: Resource.AiAssistant,
        actions: getAllActions(Resource.AiAssistant),
      },
      {
        resource: Resource.AssessmentRequest,
        actions: getAllActions(Resource.AssessmentRequest),
      },
      {
        resource: Resource.CentralRecruitRequest,
        actions: getAllActions(Resource.CentralRecruitRequest),
      },
      {
        resource: Resource.CompetencyAssessment,
        actions: getAllActions(Resource.CompetencyAssessment),
      },
      {
        resource: Resource.Location,
        actions: getAllActions(Resource.Location),
      },
    ],
  },
  {
    role: 'regulatory',
    resourcePermissions: [
      {
        resource: Resource.Dashboard,
        actions: getActionsExcept(Resource.Dashboard, [Action.ManageOwnData]),
      },
      {
        resource: Resource.User,
        actions: [Action.ManageOwnData],
      },
      {
        resource: Resource.AiAssistant,
        actions: getActionsExcept(Resource.AiAssistant, [Action.Review]),
      },
      {
        resource: Resource.AssessmentRequest,
        actions: getActionsExcept(Resource.AssessmentRequest, [
          Action.Create,
          Action.Attach,
          Action.SubmitPayment,
          Action.ProcessPayment,
          Action.ManageOwnData,
        ]),
      },
      {
        resource: Resource.CentralRecruitRequest,
        actions: getActionsExcept(Resource.AssessmentRequest, [
          Action.Create,
          Action.Attach,
          Action.SubmitPayment,
          Action.ProcessPayment,
          Action.ManageOwnData,
        ]),
      },
      {
        resource: Resource.CompetencyAssessment,
        actions: [Action.Read, Action.Report, Action.Overview],
      },
    ],
  },
  {
    role: 'operational',
    resourcePermissions: [
      {
        resource: Resource.Dashboard,
        actions: getActionsExcept(Resource.Dashboard, [Action.ManageOwnData]),
      },
      {
        resource: Resource.User,
        actions: [Action.ManageOwnData],
      },
      {
        resource: Resource.AgreementTemplate,
        actions: [Action.Read, Action.Overview, Action.Attach],
      },
      {
        resource: Resource.QuestionBankManagement,
        actions: [Action.Overview],
      },
      {
        resource: Resource.Vacancy,
        actions: getActionsExcept(Resource.Vacancy, [Action.Apply]),
      },
      {
        resource: Resource.AiAssistant,
        actions: [Action.Chat, Action.Report, Action.ManageOwnData],
      },
      {
        resource: Resource.AssessmentRequest,
        actions: [
          Action.Report,
          Action.Overview,
          Action.Attach,
          Action.ProcessPayment,
          Action.ManageOwnData,
        ],
      },
      {
        resource: Resource.CentralRecruitRequest,
        actions: [
          Action.Report,
          Action.Overview,
          Action.Attach,
          Action.ManageOwnData,
        ],
      },
      {
        resource: Resource.CompetencyAssessment,
        actions: getActionsExcept(Resource.CompetencyAssessment, [Action.Take]),
      },
    ],
  },
  {
    role: 'agency',
    resourcePermissions: [
      {
        resource: Resource.JobGrade,
        actions: [Action.Read],
      },
      {
        resource: Resource.JobCategory,
        actions: [Action.Read],
      },
      {
        resource: Resource.CompetencyLevel,
        actions: [Action.Read],
      },
      {
        resource: Resource.RequestOptions,
        actions: [Action.Read],
      },
      {
        resource: Resource.EducationalQualification,
        actions: [Action.Read],
      },
      {
        resource: Resource.MajorCareerFamily,
        actions: [Action.Read],
      },
      {
        resource: Resource.SubMajorCareerFamily,
        actions: [Action.Read],
      },
      {
        resource: Resource.Professions,
        actions: [Action.Read],
      },
      {
        resource: Resource.TypesOfCompetency,
        actions: [Action.Read],
      },
      {
        resource: Resource.LevelOfDifficulty,
        actions: [Action.Read],
      },
      {
        resource: Resource.User,
        actions: [Action.ManageOwnData],
      },
      {
        resource: Resource.AgreementTemplate,
        actions: [Action.Read, Action.Update],
      },
      {
        resource: Resource.Vacancy,
        actions: [Action.Read],
      },
      {
        resource: Resource.AssessmentRequest,
        actions: [
          Action.Create,
          Action.Read,
          Action.Update,
          Action.Delete,
          Action.Overview,
          Action.SubmitPayment,
          Action.ManageOwnData,
        ],
      },
      {
        resource: Resource.CentralRecruitRequest,
        actions: [
          Action.Create,
          Action.Read,
          Action.Update,
          Action.Delete,
          Action.Overview,
          Action.ManageOwnData,
        ],
      },
      {
        resource: Resource.CompetencyAssessment,
        actions: [Action.Read, Action.Overview, Action.ManageOwnData],
      },
    ],
  },
  {
    role: 'third-party',
    resourcePermissions: [
      {
        resource: Resource.User,
        actions: [Action.ManageOwnData],
      },
      {
        resource: Resource.Vacancy,
        actions: [Action.Read],
      },
      {
        resource: Resource.CompetencyAssessment,
        actions: [
          Action.Create,
          Action.Read,
          Action.Update,
          Action.Delete,
          Action.Overview,
          Action.Schedule,
          Action.SubmitScore,
          Action.ManageOwnData,
        ],
      },
    ],
  },
  {
    role: 'candidate',
    resourcePermissions: [
      {
        resource: Resource.User,
        actions: [Action.ManageOwnData],
      },
      {
        resource: Resource.Vacancy,
        actions: [
          Action.Read,
          Action.Apply,
          Action.Overview,
          Action.ManageOwnData,
        ],
      },
      {
        resource: Resource.CompetencyAssessment,
        actions: [
          Action.Read,
          Action.Overview,
          Action.Take,
          Action.ManageOwnData,
        ],
      },
    ],
  },
  {
    role: 'question-admin',
    resourcePermissions: [
      {
        resource: Resource.Dashboard,
        actions: getActionsExcept(Resource.Dashboard, [Action.ManageOwnData]),
      },
      {
        resource: Resource.JobGrade,
        actions: [Action.Read],
      },
      {
        resource: Resource.JobCategory,
        actions: [Action.Read],
      },
      {
        resource: Resource.CompetencyLevel,
        actions: [Action.Read],
      },
      {
        resource: Resource.RequestOptions,
        actions: [Action.Read],
      },
      {
        resource: Resource.EducationalQualification,
        actions: [Action.Read],
      },
      {
        resource: Resource.MajorCareerFamily,
        actions: [Action.Read],
      },
      {
        resource: Resource.SubMajorCareerFamily,
        actions: [Action.Read],
      },
      {
        resource: Resource.Professions,
        actions: [Action.Read],
      },
      {
        resource: Resource.User,
        actions: [Action.ManageOwnData],
      },
      {
        resource: Resource.QuestionBankManagement,
        actions: getAllActions(Resource.QuestionBankManagement),
      },
      {
        resource: Resource.Question,
        actions: getAllActions(Resource.Question),
      },
      {
        resource: Resource.AiAssistant,
        actions: [Action.Report, Action.Review, Action.ManageOwnData],
      },
    ],
  },
  {
    role: 'question-inserter',
    resourcePermissions: [
      {
        resource: Resource.JobGrade,
        actions: [Action.Read],
      },
      {
        resource: Resource.JobCategory,
        actions: [Action.Read],
      },
      {
        resource: Resource.CompetencyLevel,
        actions: [Action.Read],
      },
      {
        resource: Resource.RequestOptions,
        actions: [Action.Read],
      },
      {
        resource: Resource.EducationalQualification,
        actions: [Action.Read],
      },
      {
        resource: Resource.MajorCareerFamily,
        actions: [Action.Read],
      },
      {
        resource: Resource.SubMajorCareerFamily,
        actions: [Action.Read],
      },
      {
        resource: Resource.Professions,
        actions: [Action.Read],
      },
      {
        resource: Resource.User,
        actions: [Action.ManageOwnData],
      },
      {
        resource: Resource.QuestionBankManagement,
        actions: [Action.Create, Action.Overview, Action.ManageOwnData],
      },
      {
        resource: Resource.Question,
        actions: [Action.Create, Action.Overview, Action.ManageOwnData],
      },
    ],
  },
  {
    role: 'question-reviewer',
    resourcePermissions: [
      {
        resource: Resource.JobGrade,
        actions: [Action.Read],
      },
      {
        resource: Resource.JobCategory,
        actions: [Action.Read],
      },
      {
        resource: Resource.CompetencyLevel,
        actions: [Action.Read],
      },
      {
        resource: Resource.RequestOptions,
        actions: [Action.Read],
      },
      {
        resource: Resource.EducationalQualification,
        actions: [Action.Read],
      },
      {
        resource: Resource.MajorCareerFamily,
        actions: [Action.Read],
      },
      {
        resource: Resource.SubMajorCareerFamily,
        actions: [Action.Read],
      },
      {
        resource: Resource.Professions,
        actions: [Action.Read],
      },
      {
        resource: Resource.User,
        actions: [Action.ManageOwnData],
      },
      {
        resource: Resource.QuestionBankManagement,
        actions: [
          Action.Read,
          Action.Update,
          Action.Overview,
          Action.ManageOwnData,
        ],
      },
      {
        resource: Resource.Question,
        actions: [
          Action.Read,
          Action.Update,
          Action.Overview,
          Action.Approval,
          Action.Review,
          Action.ManageOwnData,
        ],
      },
      {
        resource: Resource.AiAssistant,
        actions: [Action.Review, Action.ManageOwnData],
      },
    ],
  },
];

/**
 * getRoleOrThrow
 * @description This function is used to get the role from the database.
 * @param db The database service.
 * @param roleName The name of the role.
 * @returns The role.
 */
async function getRoleOrThrow(db: PrismaClient, roleName: string) {
  const dbRole = await db.role.findUnique({
    where: { name: roleName },
  });

  if (!dbRole) {
    console.log(`Role not found: ${roleName}`);
    throw new Error(`Role not found: ${roleName}`);
  }

  return dbRole;
}

/**
 * getResourceOrThrow
 * @description This function is used to get the resource from the database.
 * @param db The database service.
 * @param resourceName The name of the resource.
 * @returns The resource.
 */
async function getResourceOrThrow(db: PrismaClient, resourceName: string) {
  const dbResource = await db.resource.findUnique({
    where: { name: resourceName },
  });

  if (!dbResource) {
    console.log(`Resource not found: ${resourceName}`);
    throw new Error(`Resource not found: ${resourceName}`);
  }

  return dbResource;
}

/**
 * findActionOrThrow
 * @description This function is used to get the action from the database.
 * @param db The database service.
 * @param actionName The name of the action.
 * @param resourceName The name of the resource.
 * @param roleName The name of the role.
 * @returns The action.
 */
async function findActionOrThrow(
  db: PrismaClient,
  actionName: string,
  resourceName: string,
  roleName: string,
) {
  const dbAction = await db.action.findUnique({
    where: { name: actionName },
  });

  if (!dbAction) {
    console.log(
      `Action not found: ${actionName} for resource ${resourceName} and role ${roleName}`,
    );
    throw new Error(
      `Action not found: ${actionName} for resource ${resourceName} and role ${roleName}`,
    );
  }

  return dbAction;
}

/**
 * findPermissionOrThrow
 * @description This function is used to get the permission from the database.
 * @param db The database service.
 * @param dbResource The resource.
 * @param dbAction The action.
 * @param resourceName The name of the resource.
 * @param roleName The name of the role.
 * @param actionName The name of the action.
 * @returns The permission.
 */
async function findPermissionOrThrow(
  db: PrismaClient,
  dbResource: { id: string },
  dbAction: { id: string },
  resourceName: string,
  roleName: string,
  actionName: string,
) {
  const dbPermission = await db.permission.findUnique({
    where: {
      resourceId_actionId: {
        resourceId: dbResource.id,
        actionId: dbAction.id,
      },
    },
  });

  if (!dbPermission) {
    console.log(
      `Permission not found: ${actionName} for resource ${resourceName} and role ${roleName}`,
    );
    throw new Error(
      `Permission not found: ${actionName} for resource ${resourceName} and role ${roleName}`,
    );
  }

  return dbPermission;
}

/**
 * upsertRolePermission
 * @description This function is used to upsert the role permission.
 * @param db The database service.
 * @param dbRole The role.
 * @param dbPermission The permission.
 * @param resourceName The name of the resource.
 * @param actionName The name of the action.
 * @returns The role permission.
 */
async function upsertRolePermission(
  db: PrismaClient,
  dbRole: { id: string; displayName: string | null },
  dbPermission: { id: string },
  resourceName: string,
  actionName: string,
) {
  const result = await db.rolePermission.upsert({
    where: {
      roleId_permissionId: {
        roleId: dbRole.id,
        permissionId: dbPermission.id,
      },
    },
    update: {
      roleId: dbRole.id,
      permissionId: dbPermission.id,
    },
    create: {
      roleId: dbRole.id,
      permissionId: dbPermission.id,
    },
    include: {
      role: true,
      permission: true,
    },
  });

  console.log(
    `Role permission created: ${result.role.displayName} - ${resourceName} - ${actionName}`,
  );
}

/**
 * seedRolesPermissions
 * @description This function is used to seed the roles permissions.
 * @param db The database service.
 */
export async function seedRolesPermissions(db: PrismaClient) {
  console.log('Seeding roles permissions...');
  const startTime = Date.now();

  try {
    for (const roleEntry of role_permissions) {
      const dbRole = await getRoleOrThrow(db, roleEntry.role);

      for (const resourcePermission of roleEntry.resourcePermissions) {
        const dbResource = await getResourceOrThrow(
          db,
          resourcePermission.resource,
        );

        for (const actionName of resourcePermission.actions) {
          const dbAction = await findActionOrThrow(
            db,
            actionName,
            resourcePermission.resource,
            roleEntry.role,
          );

          const dbPermission = await findPermissionOrThrow(
            db,
            dbResource,
            dbAction,
            resourcePermission.resource,
            roleEntry.role,
            actionName,
          );

          await upsertRolePermission(
            db,
            dbRole,
            dbPermission,
            resourcePermission.resource,
            actionName,
          );
        }
      }
    }

    logger.log(
      `*********** Roles permissions seeding completed in ${
        Date.now() - startTime
      }ms! ***********`,
    );
  } catch (error) {
    logger.error('Error seeding roles permissions:', error);
    throw error;
  }
}
