import { Logger } from '@nestjs/common';
import { Action } from 'src/common/auth/enums/action.enum';

import type { PrismaClient } from '@prisma/client';

const logger = new Logger('ActionsSeeder');

/**
 * actions
 * @description This array contains the actions to be seeded.
 */
const actions = [
  {
    name: Action.Create,
    description: 'Create action',
  },
  {
    name: Action.Read,
    description: 'Read action',
  },
  {
    name: Action.Update,
    description: 'Update action',
  },
  {
    name: Action.Delete,
    description: 'Delete action',
  },
  {
    name: Action.BulkDelete,
    description: 'Bulk delete action',
  },
  {
    name: Action.ManageOwnData,
    description: 'Manage own data action',
  },
  {
    name: Action.Export,
    description: 'Export action',
  },
  {
    name: Action.Import,
    description: 'Import action',
  },
  {
    name: Action.Report,
    description: 'Report action',
  },
  {
    name: Action.Overview,
    description: 'Overview action',
  },
  {
    name: Action.Approval,
    description: 'Approval action',
  },
  {
    name: Action.Attach,
    description: 'Attach action',
  },
  {
    name: Action.SubmitPayment,
    description: 'Submit payment action',
  },
  {
    name: Action.ProcessPayment,
    description: 'Process payment action',
  },
  {
    name: Action.Schedule,
    description: 'Schedule action',
  },
  {
    name: Action.Request,
    description: 'Request action',
  },
  {
    name: Action.Review,
    description: 'Review action',
  },
  {
    name: Action.Activate,
    description: 'Activate action',
  },
  {
    name: Action.Deactivate,
    description: 'Deactivate action',
  },
  {
    name: Action.Apply,
    description: 'Apply action',
  },
  {
    name: Action.Take,
    description: 'Take action',
  },
  {
    name: Action.SubmitScore,
    description: 'Submit score action',
  },
  {
    name: Action.Chat,
    description: 'Chat action',
  },
];

/**
 * seedActions
 * @description This function is used to seed the actions.
 * @param db The database service.
 */
export async function seedActions(db: PrismaClient) {
  console.log('Seeding actions...');
  const startTime = Date.now();

  try {
    for (const action of actions) {
      const result = await db.action.upsert({
        where: {
          name: action.name,
        },
        update: action,
        create: action,
      });
      console.log(`Action created: ${result.name}`);
    }

    logger.log(
      `*********** Actions seeding completed in ${Date.now() - startTime}ms! ***********`,
    );
  } catch (error) {
    logger.error('Error seeding actions:', error);
    throw error;
  }
}
