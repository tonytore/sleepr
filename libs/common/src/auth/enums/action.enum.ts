/**
 * Action enum for access control
 */
export enum Action {
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
  BulkDelete = 'bulk-delete',
  ManageOwnData = 'manage-own-data',
  Export = 'export',
  Import = 'import',
  Report = 'report',
  Overview = 'overview',
  Approval = 'approval',
  Attach = 'attach',
  SubmitPayment = 'submit-payment',
  ProcessPayment = 'process-payment',
  Schedule = 'schedule',
  Request = 'request',
  Review = 'review',
  Activate = 'activate',
  Deactivate = 'deactivate',
  Apply = 'apply',
  Take = 'take',
  SubmitScore = 'submit-score',
  Chat = 'chat',
}
