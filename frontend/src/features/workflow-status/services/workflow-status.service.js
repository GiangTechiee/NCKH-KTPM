import { apiClient } from '../../../core/api/api-client';

async function getWelcomeMessage() {
  const data = await apiClient.getJson('/api');

  return data.message;
}

async function getSystemHealth() {
  return apiClient.getJson('/api/health');
}

export const workflowStatusService = {
  getWelcomeMessage,
  getSystemHealth,
};
