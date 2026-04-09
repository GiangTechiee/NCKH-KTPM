import { useEffect, useState } from 'react';
import { workflowStatusService } from '../services/workflow-status.service';

export function useWorkflowStatus() {
  const [message, setMessage] = useState('');
  const [health, setHealth] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadWorkflowStatus() {
      try {
        setIsLoading(true);
        setErrorMessage('');

        const [welcomeMessage, systemHealth] = await Promise.all([
          workflowStatusService.getWelcomeMessage(),
          workflowStatusService.getSystemHealth(),
        ]);

        if (!isMounted) {
          return;
        }

        setMessage(welcomeMessage);
        setHealth(systemHealth);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setErrorMessage('Khong the tai du lieu tu backend.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadWorkflowStatus();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    message,
    health,
    isLoading,
    errorMessage,
  };
}
