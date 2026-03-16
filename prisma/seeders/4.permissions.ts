import { Logger } from '@nestjs/common';
import { Action } from 'src/common/auth/enums/action.enum';
import { Resource } from 'src/common/auth/enums/resource.enum';

import type { PrismaClient } from '@prisma/client';

const logger = new Logger('PermissionsSeeder');

/**
 * permissions
 * @description This array contains the permissions to be seeded.
 */
export const permissions = [
  {
    resource: Resource.Dashboard,
    actions: [Action.Read, Action.Overview, Action.ManageOwnData],
  },
  {
    resource: Resource.JobGrade,
    actions: [
      Action.Create,
      Action.Read,
      Action.Update,
      Action.Delete,
      Action.BulkDelete,
      Action.Overview,
    ],
  },
  {
    resource: Resource.JobCategory,
    actions: [
      Action.Create,
      Action.Read,
      Action.Update,
      Action.Delete,
      Action.BulkDelete,
      Action.Overview,
    ],
  },
  {
    resource: Resource.CompetencyLevel,
    actions: [
      Action.Create,
      Action.Read,
      Action.Update,
      Action.Delete,
      Action.BulkDelete,
      Action.Overview,
    ],
  },
  {
    resource: Resource.RequestOptions,
    actions: [
      Action.Create,
      Action.Read,
      Action.Update,
      Action.Delete,
      Action.BulkDelete,
      Action.Overview,
    ],
  },
  {
    resource: Resource.EducationalQualification,
    actions: [
      Action.Create,
      Action.Read,
      Action.Update,
      Action.Delete,
      Action.BulkDelete,
      Action.Overview,
    ],
  },
  {
    resource: Resource.MajorCareerFamily,
    actions: [
      Action.Create,
      Action.Read,
      Action.Update,
      Action.Delete,
      Action.BulkDelete,
      Action.Export,
      Action.Import,
      Action.Overview,
    ],
  },
  {
    resource: Resource.SubMajorCareerFamily,
    actions: [
      Action.Create,
      Action.Read,
      Action.Update,
      Action.Delete,
      Action.BulkDelete,
      Action.Export,
      Action.Import,
      Action.Overview,
    ],
  },
  {
    resource: Resource.Professions,
    actions: [
      Action.Create,
      Action.Read,
      Action.Update,
      Action.Delete,
      Action.BulkDelete,
      Action.Export,
      Action.Import,
      Action.Overview,
    ],
  },
  {
    resource: Resource.TypesOfCompetency,
    actions: [
      Action.Create,
      Action.Read,
      Action.Update,
      Action.Delete,
      Action.BulkDelete,
      Action.Overview,
    ],
  },
  {
    resource: Resource.LevelOfDifficulty,
    actions: [
      Action.Create,
      Action.Read,
      Action.Update,
      Action.Delete,
      Action.BulkDelete,
      Action.Overview,
    ],
  },
  {
    resource: Resource.User,
    actions: [
      Action.Create,
      Action.Read,
      Action.Update,
      Action.Delete,
      Action.BulkDelete,
      Action.Export,
      Action.Import,
      Action.Overview,
      Action.Activate,
      Action.Deactivate,
      Action.ManageOwnData,
    ],
  },
  {
    resource: Resource.Role,
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
    resource: Resource.Resource,
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
    resource: Resource.Action,
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
    resource: Resource.Permission,
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
    resource: Resource.AgreementTemplate,
    actions: [
      Action.Create,
      Action.Read,
      Action.Update,
      Action.Delete,
      Action.BulkDelete,
      Action.Overview,
      Action.Attach,
    ],
  },
  {
    resource: Resource.QuestionBankManagement,
    actions: [
      Action.Create,
      Action.Read,
      Action.Update,
      Action.Delete,
      Action.BulkDelete,
      Action.Overview,
      Action.ManageOwnData,
    ],
  },
  {
    resource: Resource.Question,
    actions: [
      Action.Create,
      Action.Read,
      Action.Update,
      Action.Delete,
      Action.BulkDelete,
      Action.Export,
      Action.Import,
      Action.Report,
      Action.Overview,
      Action.Approval,
      Action.Schedule,
      Action.Review,
      Action.ManageOwnData,
    ],
  },
  {
    resource: Resource.Vacancy,
    actions: [
      Action.Create,
      Action.Read,
      Action.Update,
      Action.Delete,
      Action.BulkDelete,
      Action.Report,
      Action.Apply,
      Action.Overview,
      Action.ManageOwnData,
    ],
  },
  {
    resource: Resource.AiAssistant,
    actions: [
      Action.Chat,
      Action.Report,
      Action.Overview,
      Action.Review,
      Action.ManageOwnData,
    ],
  },
  {
    resource: Resource.AssessmentRequest,
    actions: [
      Action.Create,
      Action.Read,
      Action.Update,
      Action.Delete,
      Action.Report,
      Action.Overview,
      Action.Approval,
      Action.Attach,
      Action.SubmitPayment,
      Action.ProcessPayment,
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
      Action.Report,
      Action.Overview,
      Action.Approval,
      Action.Attach,
      Action.ManageOwnData,
    ],
  },
  {
    resource: Resource.CompetencyAssessment,
    actions: [
      Action.Create,
      Action.Read,
      Action.Update,
      Action.Delete,
      Action.Report,
      Action.Overview,
      Action.Schedule,
      Action.Take,
      Action.SubmitScore,
      Action.ManageOwnData,
    ],
  },
  {
    resource: Resource.Location,
    actions: [
      Action.Create,
      Action.Read,
      Action.Update,
      Action.Delete,
      Action.BulkDelete,
      Action.Overview,
      Action.ManageOwnData,
    ],
  },
];

/**
 * seedPermissions
 * @description This function is used to seed the permissions.
 * @param db The database service.
 */
export async function seedPermissions(db: PrismaClient) {
  console.log('Seeding permissions...');
  const startTime = Date.now();

  try {
    for (const permission of permissions) {
      const resource = await db.resource.findUnique({
        where: {
          name: permission.resource,
        },
      });

      if (!resource) {
        throw new Error(`Resource ${permission.resource} not found`);
      }

      for (const action of permission.actions) {
        const dbAction = await db.action.findUnique({
          where: {
            name: action,
          },
        });

        if (!dbAction) {
          throw new Error(`Action ${action} not found`);
        }

        const result = await db.permission.upsert({
          where: {
            resourceId_actionId: {
              resourceId: resource.id,
              actionId: dbAction.id,
            },
          },
          update: {
            resourceId: resource.id,
            actionId: dbAction.id,
          },
          create: {
            resourceId: resource.id,
            actionId: dbAction.id,
          },
          select: {
            resource: true,
            action: true,
          },
        });

        console.log(
          `Permission created: ${result.resource.name} - ${result.action.name}`,
        );
      }
    }

    logger.log(
      `*********** Permissions seeding completed in ${Date.now() - startTime}ms! ***********`,
    );
  } catch (error) {
    logger.error('Error seeding permissions:', error);
    throw error;
  }
}
