import { type ReactNode } from 'react';

interface EmptyStateProps {
  emoji: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function EmptyState({ emoji, title, subtitle, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="text-5xl mb-3">{emoji}</div>
      <p className="text-lg font-bold text-[#171717]">{title}</p>
      {subtitle && <p className="text-sm text-[#6B6B6B] mt-1 max-w-xs">{subtitle}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
