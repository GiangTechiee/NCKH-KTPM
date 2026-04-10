const { AuditAction, AuditEntityType } = require('./audit-log.constants');
const { MAX_GROUP_MEMBERS, TOPIC_SOURCE } = require('./business.constants');
const {
  StudentWorkflowStatus,
  GroupStatus,
  TopicSubmissionStatus,
  InvitationStatus,
} = require('./status.enum');
const {
  GROUP_STATUS_TRANSITIONS,
  TOPIC_SUBMISSION_STATUS_TRANSITIONS,
} = require('./workflow-transitions');

module.exports = {
  AuditAction,
  AuditEntityType,
  MAX_GROUP_MEMBERS,
  TOPIC_SOURCE,
  StudentWorkflowStatus,
  GroupStatus,
  TopicSubmissionStatus,
  InvitationStatus,
  GROUP_STATUS_TRANSITIONS,
  TOPIC_SUBMISSION_STATUS_TRANSITIONS,
};
