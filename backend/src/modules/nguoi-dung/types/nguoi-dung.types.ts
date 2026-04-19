import { GroupStatus, StudentWorkflowStatus } from '../../../common/constants';

interface StudentAccountOption {
  code: string;
  displayName: string;
  fullName: string;
  className: string | null;
  facultyName: string | null;
  workflowStatus: StudentWorkflowStatus;
  researchAreaCode: string | null;
  researchAreaName: string | null;
  registrationStatus: string | null;
  groupName: string | null;
  groupStatus: GroupStatus | null;
  topicName: string | null;
  topicStatus: string | null;
}

interface LecturerSupervisionSummary {
  currentGroupCount: number;
  maxGroupCount: number;
  availableSlots: number;
}

interface LecturerRecentGroupOption {
  groupName: string;
  groupStatus: string;
}

interface LecturerAccountOption {
  code: string;
  displayName: string;
  fullName: string;
  departmentName: string | null;
  expertise: string | null;
  supervision: LecturerSupervisionSummary;
  recentGroups: LecturerRecentGroupOption[];
}

export { LecturerAccountOption, LecturerRecentGroupOption, LecturerSupervisionSummary, StudentAccountOption };
