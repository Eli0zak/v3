import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface Shortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  action: () => void;
}

export const useKeyboardShortcuts = (shortcuts: Shortcut[]) => {
  const navigate = useNavigate();

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    shortcuts.forEach((shortcut) => {
      if (
        event.key.toLowerCase() === shortcut.key.toLowerCase() &&
        !!event.ctrlKey === !!shortcut.ctrlKey &&
        !!event.shiftKey === !!shortcut.shiftKey &&
        !!event.altKey === !!shortcut.altKey &&
        !!event.metaKey === !!shortcut.metaKey
      ) {
        event.preventDefault();
        shortcut.action();
      }
    });
  }, [shortcuts]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};

// Common shortcuts for the application
export const commonShortcuts = [
  {
    key: 'n',
    ctrlKey: true,
    action: () => navigate('/pets/new')
  },
  {
    key: 'd',
    ctrlKey: true,
    action: () => navigate('/dashboard')
  },
  {
    key: 'p',
    ctrlKey: true,
    action: () => navigate('/pets')
  },
  {
    key: 'a',
    ctrlKey: true,
    action: () => navigate('/account')
  },
  {
    key: 'l',
    ctrlKey: true,
    action: () => navigate('/login')
  },
  {
    key: 'q',
    ctrlKey: true,
    action: () => navigate('/')
  }
]; 