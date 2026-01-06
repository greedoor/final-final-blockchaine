import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  isLoading?: boolean;
  className?: string;
  delay?: number;
}

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  isLoading = false,
  className,
  delay = 0,
}: StatCardProps) => {
  return (
    <div
      className={cn(
        'bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow',
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          {isLoading ? (
            <div className="h-8 w-24 rounded-md bg-gray-200 animate-pulse" />
          ) : (
            <p className="text-2xl md:text-3xl font-bold text-gray-800">
              {value}
            </p>
          )}
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
            <Icon className="w-6 h-6 text-indigo-600" />
          </div>
        )}
      </div>
    </div>
  );
};
