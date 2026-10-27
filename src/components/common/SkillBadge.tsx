import React from 'react';
import { Headphones, BookOpen, Mic, PenTool, Sparkles, BookCheck } from 'lucide-react';
import { SkillType } from '../../types';

interface SkillBadgeProps {
  skill: SkillType;
  showIcon?: boolean;
  className?: string;
}

export const SKILL_METADATA: Record<SkillType, { label: string; icon: React.ElementType; colorText: string; colorBg: string; borderColor: string; hex: string }> = {
  listening: {
    label: 'Listening',
    icon: Headphones,
    colorText: 'text-sky-700 dark:text-sky-400',
    colorBg: 'bg-sky-50 dark:bg-sky-950/50',
    borderColor: 'border-sky-200 dark:border-sky-800',
    hex: '#0284c7'
  },
  reading: {
    label: 'Reading',
    icon: BookOpen,
    colorText: 'text-emerald-700 dark:text-emerald-400',
    colorBg: 'bg-emerald-50 dark:bg-emerald-950/50',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
    hex: '#059669'
  },
  speaking: {
    label: 'Speaking',
    icon: Mic,
    colorText: 'text-amber-700 dark:text-amber-400',
    colorBg: 'bg-amber-50 dark:bg-amber-950/50',
    borderColor: 'border-amber-200 dark:border-amber-800',
    hex: '#d97706'
  },
  writing: {
    label: 'Writing',
    icon: PenTool,
    colorText: 'text-violet-700 dark:text-violet-400',
    colorBg: 'bg-violet-50 dark:bg-violet-950/50',
    borderColor: 'border-violet-200 dark:border-violet-800',
    hex: '#7c3aed'
  },
  vocabulary: {
    label: 'Vocabulário',
    icon: Sparkles,
    colorText: 'text-rose-700 dark:text-rose-400',
    colorBg: 'bg-rose-50 dark:bg-rose-950/50',
    borderColor: 'border-rose-200 dark:border-rose-800',
    hex: '#e11d48'
  },
  grammar: {
    label: 'Gramática',
    icon: BookCheck,
    colorText: 'text-indigo-700 dark:text-indigo-400',
    colorBg: 'bg-indigo-50 dark:bg-indigo-950/50',
    borderColor: 'border-indigo-200 dark:border-indigo-800',
    hex: '#4f46e5'
  }
};

export const SkillBadge: React.FC<SkillBadgeProps> = ({ skill, showIcon = true, className = '' }) => {
  const meta = SKILL_METADATA[skill] || SKILL_METADATA.listening;
  const Icon = meta.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${meta.colorText} ${className}`}>
      {showIcon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      <span>{meta.label}</span>
    </span>
  );
};
