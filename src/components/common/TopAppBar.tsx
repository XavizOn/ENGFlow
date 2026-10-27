import React from 'react';
import { Flame, Shield, HelpCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface TopAppBarProps {
  onOpenDocs: () => void;
  onOpenSettings: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({ onOpenDocs }) => {
  const { state } = useApp();
  const { streak, profile } = state;

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/70 dark:border-slate-800">
      <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
        {/* Brand Zone */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-extrabold text-sm shadow-xs">
            E
          </div>
          <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
            EngFlow
          </span>
          <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {profile.level}
          </span>
        </div>

        {/* Status & Actions Zone */}
        <div className="flex items-center gap-2.5">
          {/* Streak indicator */}
          <div 
            title={`Sequência atual: ${streak.currentStreak} dias cumpridos`}
            className="flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-1 rounded-full border border-amber-200/60 dark:border-amber-900/40"
          >
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span className="tabular-nums">{streak.currentStreak}d</span>
          </div>

          {/* Rest tokens indicator */}
          <div 
            title={`${streak.restTokensAvailable} Token(s) de descanso disponível(is)`}
            className="flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-1 rounded-full border border-emerald-200/60 dark:border-emerald-900/40"
          >
            <Shield className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
            <span className="tabular-nums">{streak.restTokensAvailable}</span>
          </div>

          {/* Quick docs action */}
          <button
            onClick={onOpenDocs}
            className="min-h-[40px] min-w-[40px] flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors rounded-lg"
            title="Ver Documentação e Mapeamento Android Jetpack Compose"
            aria-label="Documentação de arquitetura"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
