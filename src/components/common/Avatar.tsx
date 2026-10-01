import React from 'react';
import { User as UserIcon } from 'lucide-react';

interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  frame?: string;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name = '',
  size = 'md',
  frame,
  className = '',
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-xl',
  }[size];

  // Frame styling based on equipped item
  const getFrameClasses = (f?: string) => {
    if (!f) return '';
    switch (f.toLowerCase()) {
      case 'gold':
      case 'frame-gold':
        return 'ring-2 ring-amber-400 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 shadow-[0_0_10px_rgba(251,191,36,0.6)]';
      case 'neon':
      case 'frame-neon':
        return 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 shadow-[0_0_10px_rgba(34,211,238,0.7)]';
      case 'fire':
      case 'frame-fire':
        return 'ring-2 ring-rose-500 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 shadow-[0_0_12px_rgba(244,63,94,0.7)] animate-pulse';
      case 'cyber':
      case 'frame-cyber':
        return 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 shadow-[0_0_10px_rgba(16,185,129,0.7)]';
      case 'rainbow':
      case 'frame-rainbow':
        return 'ring-2 ring-purple-500 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 shadow-[0_0_12px_rgba(168,85,247,0.7)]';
      case 'diamond':
      case 'frame-diamond':
        return 'ring-2 ring-blue-300 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 shadow-[0_0_12px_rgba(147,197,253,0.8)]';
      case 'galaxy':
      case 'frame-galaxy':
        return 'ring-2 ring-violet-500 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 shadow-[0_0_12px_rgba(139,92,246,0.8)]';
      default:
        return 'ring-2 ring-indigo-400 ring-offset-1';
    }
  };

  const frameClass = getFrameClasses(frame);

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
        className={`rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-700 shadow-xs ${sizeClasses} ${frameClass} ${className}`}
      />
    );
  }

  return (
    <div
      className={`rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-center shrink-0 border border-indigo-200 dark:border-indigo-800 shadow-xs ${sizeClasses} ${frameClass} ${className}`}
    >
      {name ? getInitials(name) : <UserIcon className="w-1/2 h-1/2" />}
    </div>
  );
};
