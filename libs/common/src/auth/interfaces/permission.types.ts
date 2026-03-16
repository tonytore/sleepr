import { Action } from '../enums/action.enum';
import { Resource } from '../enums/resource.enum';

/**
 * Mapping of resources to their valid actions based on seed data.
 */
export type ResourceActionMap = {
  [Resource.Dashboard]: Action.Overview | Action.Read | Action.ManageOwnData;
  [Resource.JobGrade]:
    | Action.Create
    | Action.Read
    | Action.Update
    | Action.Delete
    | Action.BulkDelete
    | Action.Overview;
  [Resource.JobCategory]:
    | Action.Create
    | Action.Read
    | Action.Update
    | Action.Delete
    | Action.BulkDelete
    | Action.Overview;
  [Resource.CompetencyLevel]:
    | Action.Create
    | Action.Read
    | Action.Update
    | Action.Delete
    | Action.BulkDelete
    | Action.Overview;
  [Resource.RequestOptions]:
    | Action.Create
    | Action.Read
    | Action.Update
    | Action.Delete
    | Action.BulkDelete
    | Action.Overview;
  [Resource.EducationalQualification]:
    | Action.Create
    | Action.Read
    | Action.Update
    | Action.Delete
    | Action.BulkDelete
    | Action.Overview;
  [Resource.MajorCareerFamily]:
    | Action.Create
    | Action.Read
    | Action.Update
    | Action.Delete
    | Action.BulkDelete
    | Action.Export
    | Action.Import
    | Action.Overview;
  [Resource.SubMajorCareerFamily]:
    | Action.Create
    | Action.Read
    | Action.Update
    | Action.Delete
    | Action.BulkDelete
    | Action.Export
    | Action.Import
    | Action.Overview;
  [Resource.Professions]:
    | Action.Create
    | Action.Read
    | Action.Update
    | Action.Delete
    | Action.BulkDelete
    | Action.Export
    | Action.Import
    | Action.Overview;
  [Resource.TypesOfCompetency]:
    | Action.Create
    | Action.Read
    | Action.Update
    | Action.Delete
    | Action.BulkDelete
    | Action.Overview;
  [Resource.LevelOfDifficulty]:
    | Action.Create
    | Action.Read
    | Action.Update
    | Action.Delete
    | Action.BulkDelete
    | Action.Overview;
  [Resource.User]:
    | Action.Create
    | Action.Read
    | Action.Update
    | Action.Delete
    | Action.BulkDelete
    | Action.Export
    | Action.Import
    | Action.Overview
    | Action.Activate
    | Action.Deactivate
    | Action.ManageOwnData;
  [Resource.Role]:
    | Action.Create
    | Action.Read
    | Action.Update
    | Action.Delete
    | Action.Overview
    | Action.ManageOwnData;
  [Resource.Resource]:
    | Action.Create
    | Action.Read
    | Action.Update
    | Action.Delete
    | Action.Overview
    | Action.ManageOwnData;
  [Resource.Action]:
    | Action.Create
    | Action.Read
    | Action.Update
    | Action.Delete
    | Action.Overview
    | Action.ManageOwnData;
  [Resource.Permission]:
    | Action.Create
    | Action.Read
    | Action.Update
    | Action.Delete
    | Action.Overview
    | Action.ManageOwnData;
  [Resource.AgreementTemplate]:
    | Action.Create
    | Action.Read
    | Action.Update
    | Action.Delete
    | Action.BulkDelete
    | Action.Overview
    | Action.Attach;
  [Resource.QuestionBankManagement]:
    | Action.Create
    | Action.Read
    | Action.Update
    | Action.Delete
    | Action.BulkDelete
    | Action.Overview
    | Action.ManageOwnData;
  [Resource.Question]:
    | Action.Create
    | Action.Read
    | Action.Update
    | Action.Delete
    | Action.BulkDelete
    | Action.Export
    | Action.Import
    | Action.Report
    | Action.Overview
    | Action.Approval
    | Action.Schedule
    | Action.Review
    | Action.ManageOwnData;
  [Resource.Vacancy]:
    | Action.Create
    | Action.Read
    | Action.Update
    | Action.Delete
    | Action.BulkDelete
    | Action.Report
    | Action.Apply
    | Action.Overview
    | Action.ManageOwnData;
  [Resource.AiAssistant]:
    | Action.Chat
    | Action.Report
    | Action.Overview
    | Action.Review
    | Action.ManageOwnData;
  [Resource.AssessmentRequest]:
    | Action.Create
    | Action.Read
    | Action.Update
    | Action.Delete
    | Action.Report
    | Action.Overview
    | Action.Approval
    | Action.Attach
    | Action.SubmitPayment
    | Action.ProcessPayment
    | Action.ManageOwnData;
  [Resource.CentralRecruitRequest]:
    | Action.Create
    | Action.Read
    | Action.Update
    | Action.Delete
    | Action.Report
    | Action.Overview
    | Action.Approval
    | Action.Attach
    | Action.ManageOwnData;
  [Resource.CompetencyAssessment]:
    | Action.Create
    | Action.Read
    | Action.Update
    | Action.Delete
    | Action.Report
    | Action.Overview
    | Action.Schedule
    | Action.Take
    | Action.SubmitScore
    | Action.ManageOwnData;
  [Resource.Location]:
    | Action.Create
    | Action.Read
    | Action.Update
    | Action.Delete
    | Action.BulkDelete
    | Action.Overview
    | Action.ManageOwnData;
};

/**
 * Distributed conditional type that creates a union of all valid resource-action pairs.
 */
export type RequiredPermission = {
  [K in Resource]: {
    resource: K;
    action: ResourceActionMap[K];
  };
}[Resource];
