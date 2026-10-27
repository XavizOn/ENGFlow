import React from 'react';
import { LayoutDashboard, CalendarRange, PlayCircle, BarChart3 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppState } from '../../types';

export const BottomTabBar: React.FC = () => {
  const { state, navigateTo } = useApp();
  const currentScreen = state.activeScreen;

  const tabs: { id: AppState['activeScreen']; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Hoje', icon: LayoutDashboard },
    { id: 'routine', label: 'Rotina', icon: CalendarRange },
    { id: 'session', label: 'Sessão', icon: PlayCircle },
    { id: 'progress', label: 'Progresso', icon: BarChart3 }
  ];

  return (
    <nav 
      aria-label="Navegação principal do aplicativo"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800"
    >
      <div className="max-w-md mx-auto grid grid-cols-4 items-center h-16 px-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = currentScreen === tab.id;
          const isSessionTab = tab.id === 'session';
          const hasActiveTask = isSessionTab && !!state.activeTaskId;

          return (
            <button
              key={tab.id}
              onClick={() => navigateTo(tab.id)}
              className={`min-h-[48px] min-w-[48px] flex flex-col items-center justify-center transition-colors relative ${
                isActive 
                  ? 'text-blue-600 dark:text-blue-400 font-semibold' 
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                {hasActiveTask && !isActive && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full" />
                )}
              </div>
              <span className="text-[11px] tracking-tight mt-1 truncate">
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-4 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
