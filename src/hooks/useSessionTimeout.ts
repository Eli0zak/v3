import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from '@/lib/supabase/auth';
import { toast } from '@/hooks/use-toast';

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const WARNING_TIMEOUT = 5 * 60 * 1000; // 5 minutes

export function useSessionTimeout() {
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [warningTimeoutId, setWarningTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  const resetTimeout = () => {
    // Clear existing timeouts
    if (timeoutId) clearTimeout(timeoutId);
    if (warningTimeoutId) clearTimeout(warningTimeoutId);

    // Set new warning timeout
    const warningId = setTimeout(() => {
      toast({
        title: "Session Expiring Soon",
        description: "Your session will expire in 5 minutes. Click to extend your session.",
        action: {
          label: "Extend Session",
          onClick: resetTimeout
        }
      });
    }, SESSION_TIMEOUT - WARNING_TIMEOUT);

    // Set new session timeout
    const id = setTimeout(async () => {
      await signOut();
      toast({
        title: "Session Expired",
        description: "Your session has expired. Please log in again.",
      });
      navigate('/login');
    }, SESSION_TIMEOUT);

    setTimeoutId(id);
    setWarningTimeoutId(warningId);
  };

  useEffect(() => {
    // Set up event listeners for user activity
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    const handleActivity = () => resetTimeout();

    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    // Initial timeout setup
    resetTimeout();

    // Cleanup
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      if (timeoutId) clearTimeout(timeoutId);
      if (warningTimeoutId) clearTimeout(warningTimeoutId);
    };
  }, []);

  return { resetTimeout };
} 