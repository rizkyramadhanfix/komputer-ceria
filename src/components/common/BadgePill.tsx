import React from 'react';
import { Award, Crown, Shield, Sparkles, Star } from 'lucide-react';
import { BadgeTier } from '../../types';

interface BadgePillProps {
  tier: BadgeTier;
  points?: number;
  stars?: number;
  size?: 'sm' | 'md' | 'lg';
  showPoints?: boolean;
}

export const BadgePill: React.FC<BadgePillProps> = ({
  tier,
  points,
  stars,
  size = 'md',
  showPoints = false,
}) => {
  const getBadgeConfig = () => {
    switch (tier) {
      case 'Diamond':
        return {
          icon: <Crown className="w-3.5 h-3.5 text-indigo-500 shrink-0" />,
          label: 'Diamond Champion',
          colorClass: 'text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800',
        };
      case 'Gold':
        return {
          icon: <Sparkles className="w-3.5 h-3.5 text-yellow-600 dark:text-yellow-400 shrink-0" />,
          label: 'Gold Master',
          colorClass: 'text-yellow-800 dark:text-yellow-300 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800',
        };
      case 'Silver':
        return {
          icon: <Award className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />,
          label: 'Silver Specialist',
          colorClass: 'text-sky-800 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 border-sky-200 dark:border-sky-800',
        };
      case 'Bronze':
        return {
          icon: <Shield className="w-3.5 h-3.5 text-amber-700 dark:text-amber-500 shrink-0" />,
          label: 'Bronze Achiever',
          colorClass: 'text-amber-800 dark:text-amber-400 bg-orange-50 dark:bg-orange-950/60 border-orange-200 dark:border-orange-800',
        };
      case 'Novice':
      default:
        return {
          icon: <Star className="w-3.5 h-3.5 text-slate-500 shrink-0" />,
          label: 'Novice Explorer',
          colorClass: 'text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
        };
    }
  };

  const config = getBadgeConfig();

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2',
  }[size];

  return (
    <span
      className={`inline-flex items-center font-medium rounded-md border ${config.colorClass} ${sizeClasses} whitespace-nowrap`}
    >
      {config.icon}
      <span>{config.label}</span>
      {showPoints && points !== undefined && (
        <span className="text-slate-400 dark:text-slate-500 text-[11px] font-mono tabular-nums">
          ({points} pt)
        </span>
      )}
    </span>
  );
};
