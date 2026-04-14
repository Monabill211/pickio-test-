import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ErrorDisplayProps {
  message?: string;
  type?: 'error' | 'warning' | 'info' | 'success';
  className?: string;
  showIcon?: boolean;
  onClose?: () => void;
  dismissible?: boolean;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  message,
  type = 'error',
  className,
  showIcon = true,
  onClose,
  dismissible = false,
}) => {
  if (!message) return null;

  const variants = {
    error: {
      container: 'bg-destructive/10 border-destructive/20 text-destructive',
      icon: AlertCircle,
    },
    warning: {
      container: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-700 dark:text-yellow-600',
      icon: AlertTriangle,
    },
    info: {
      container: 'bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-600',
      icon: Info,
    },
    success: {
      container: 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-600',
      icon: CheckCircle,
    },
  };

  const variant = variants[type];
  const Icon = variant.icon;

  return (
    <div
      className={cn(
        'rounded-lg border p-3 flex items-center gap-2 text-sm',
        variant.container,
        className
      )}
      role="alert"
    >
      {showIcon && <Icon className="h-4 w-4 flex-shrink-0" />}
      <span className="flex-1">{message}</span>
      {dismissible && onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 text-current opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Dismiss"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default ErrorDisplay;
