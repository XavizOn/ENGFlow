import React, { useState } from 'react';
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  SlidersHorizontal,
  Coffee
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DAY_NAMES, FULL_DAY_NAMES } from '../utils/routineGenerator';
import { SKILL_METADATA } from './common/SkillBadge';

export const WeeklyRoutineScreen: React.FC = () => {
  const { state, startTask, updateSettings } = useApp();
  const { tasks, profile } = state;

  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(1); // Default to Tuesday (Ter)
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<string>('all');
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);

  const dayTasks = tasks.filter(t => t.dayIndex === selectedDayIndex);
  
  const filteredDayTasks = dayTasks.filter(task => {
    if (selectedSkillFilter === 'all') return true;
    return task.skill === selectedSkillFilter;
  });

  const isRestDay = dayTasks.length === 0;

  const totalPlannedMinutes = dayTasks.reduce((acc, t) => acc + t.estimatedMinutes, 0);
  const totalStudiedMinutes = dayTasks.reduce((acc, t) => acc + (t.status === 'completed' ? t.estimatedMinutes : 0), 0);

  const isToday = selectedDayIndex === 1;

  return (
    <div className="space-y-4 pb-8">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Planejamento Semanal
          </span>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Rotina das 4 Habilidades
          </h1>
        </div>

        <button
          onClick={() => setShowConfigModal(true)}
          className="min-h-[40px] px-3 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors"
          title="Ajustar Meta e Dias da Semana"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Ajustar Plano</span>
        </button>
      </div>

      {/* Horizontal Day Selector */}
      <div className="flex items-center justify-between gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl">
        {DAY_NAMES.map((name, idx) => {
          const isSelected = selectedDayIndex === idx;
          const dayTasksCount = tasks.filter(t => t.dayIndex === idx).length;
          const completedCount = tasks.filter(t => t.dayIndex === idx && t.status === 'completed').length;
          const isDayPlanned = dayTasksCount > 0;
          const allCompleted = isDayPlanned && completedCount === dayTasksCount;

          return (
            <button
              key={name}
              onClick={() => setSelectedDayIndex(idx)}
              className={`flex-1 min-h-[52px] rounded-xl flex flex-col items-center justify-center transition-all ${
                isSelected
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 font-bold shadow-xs ring-1 ring-blue-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <span className="text-[11px] font-semibold">{name}</span>
              
              <div className="mt-1 flex items-center justify-center">
                {allCompleted ? (
                  <span className="w-2 h-2 rounded-full bg-emerald-500" title="Todas concluídas" />
                ) : isDayPlanned ? (
                  <span className="text-[10px] tabular-nums text-slate-500 font-medium">
                    {completedCount}/{dayTasksCount}
                  </span>
                ) : (
                  <span title="Descanso planejado">
                    <Coffee className="w-3 h-3 text-slate-400" />
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Day Info Banner */}
      <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-slate-900 dark:text-white">
              {FULL_DAY_NAMES[selectedDayIndex]}
            </span>
            {isToday && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                Hoje
              </span>
            )}
          </div>
          <div className="text-xs text-slate-500">
            {isRestDay ? (
              <span>Dia de descanso planejado para recuperação cognitiva.</span>
            ) : (
              <span>Meta diária planejada: <strong className="tabular-nums text-slate-700 dark:text-slate-300">{totalPlannedMinutes} min</strong></span>
            )}
          </div>
        </div>

        {!isRestDay && (
          <div className="text-right">
            <span className="text-xs font-bold text-slate-900 dark:text-white tabular-nums">
              {totalStudiedMinutes} / {totalPlannedMinutes} min
            </span>
            <div className="text-[10px] text-slate-400">cumpridos</div>
          </div>
        )}
      </div>

      {/* Skill Filter Segmented Buttons */}
      {!isRestDay && (
        <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar text-xs">
          {[
            { id: 'all', label: 'Todas as atividades' },
            { id: 'listening', label: 'Listening' },
            { id: 'speaking', label: 'Speaking' },
            { id: 'reading', label: 'Reading' },
            { id: 'writing', label: 'Writing' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedSkillFilter(item.id)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 transition-colors ${
                selectedSkillFilter === item.id
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* Task List for Selected Day */}
      {isRestDay ? (
        <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center mx-auto">
            <Coffee className="w-6 h-6" />
          </div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Dia Livre Programado
          </h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
            Sua meta semanal de {profile.weeklyDaysGoal} dias deixa este dia livre para descanso sem penalizar sua sequência de estudos.
          </p>
        </div>
      ) : filteredDayTasks.length === 0 ? (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
          Nenhuma atividade encontrada com o filtro selecionado neste dia.
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredDayTasks.map((task) => {
            const skillInfo = SKILL_METADATA[task.skill] || SKILL_METADATA.listening;
            const Icon = skillInfo.icon;
            const isCompleted = task.status === 'completed';
            const isInProgress = task.status === 'in_progress';

            return (
              <div
                key={task.id}
                onClick={() => startTask(task.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isCompleted
                    ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 opacity-85'
                    : isInProgress
                    ? 'bg-blue-50/50 dark:bg-blue-950/30 border-blue-400 dark:border-blue-700 shadow-xs'
                    : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${skillInfo.colorBg} ${skillInfo.colorText}`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {skillInfo.label}
                      </span>
                      <span>·</span>
                      <span className="tabular-nums flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {task.estimatedMinutes} min estimados
                      </span>
                    </div>

                    <h2 className={`text-sm font-bold leading-tight ${isCompleted ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                      {task.title}
                    </h2>

                    <p className="text-xs text-slate-500 line-clamp-1">
                      {task.subtitle}
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center">
                    {isCompleted ? (
                      <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4" />
                      </span>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startTask(task.id);
                        }}
                        className="min-h-[38px] px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <span>{isInProgress ? 'Continuar' : 'Praticar'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Interactive Adjustment Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-2xl p-5 space-y-4 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Ajustar Metas da Rotina
              </h2>
              <button
                onClick={() => setShowConfigModal(false)}
                className="text-xs text-slate-500 hover:text-slate-900 font-semibold p-1"
              >
                Fechar
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Minutos de estudo por dia:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[15, 25, 45, 60].map(mins => (
                    <button
                      key={mins}
                      onClick={() => updateSettings({ dailyMinutesGoal: mins })}
                      className={`min-h-[44px] rounded-xl text-xs font-bold transition-all ${
                        profile.dailyMinutesGoal === mins
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {mins} min
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Dias de estudo por semana:
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {[3, 4, 5, 6, 7].map(days => (
                    <button
                      key={days}
                      onClick={() => updateSettings({ weeklyDaysGoal: days })}
                      className={`min-h-[44px] rounded-xl text-xs font-bold transition-all ${
                        profile.weeklyDaysGoal === days
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {days} dias
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-500">
              Ao alterar a meta, a grade da rotina semanal é redistribuída mantendo a proporcionalidade das 4 habilidades.
            </p>

            <button
              onClick={() => setShowConfigModal(false)}
              className="w-full min-h-[46px] rounded-xl bg-blue-600 text-white font-bold text-sm"
            >
              Concluir Ajustes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
