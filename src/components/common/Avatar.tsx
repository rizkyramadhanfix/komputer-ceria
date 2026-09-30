import React from 'react';
import { User as UserIcon } from 'lucide-react';

interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name = '',
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-xl',
  }[size];

  // Get initials if no image
  const getInitials = (n: string) => {
    if (!n) return 'U';
    const parts = n.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name || 'Avatar Pengguna'}
        className={`rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-700 shadow-xs ${sizeClasses} ${className}`}
      />
    );
  }

  return (
    <div
      className={`rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-center shrink-0 border border-indigo-200 dark:border-indigo-800 shadow-xs ${sizeClasses} ${className}`}
    >
      {name ? getInitials(name) : <UserIcon className="w-1/2 h-1/2" />}
    </div>
  );
};
