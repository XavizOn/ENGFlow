import React from 'react';
import { 
  Play, 
  CheckCircle2, 
  Clock, 
  Flame, 
  Shield, 
  Calendar, 
  TrendingUp, 
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SKILL_METADATA } from './common/SkillBadge';

export const DashboardScreen: React.FC = () => {
  const { 
    state, 
    startTask, 
    navigateTo, 
    todayStudiedMinutes, 
    todayGoalMinutes, 
    todayProgressPercentage,
    todayTasks,
    nextRecommendedTask
  } = useApp();

  const { profile, streak } = state;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const isTodayGoalAchieved = todayStudiedMinutes >= todayGoalMinutes;

  return (
    <div className="space-y-5 pb-8">
      {/* 1. Contextual Greeting & Goal Overview */}
      <section className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {getGreeting()}, {profile.name}
          </span>
          <span className="text-xs font-medium text-slate-500">
            Terça-feira · Hoje
          </span>
        </div>

        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {isTodayGoalAchieved 
            ? 'Meta de hoje cumprida!' 
            : 'Foco no progresso diário'}
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-300">
          {isTodayGoalAchieved 
            ? 'Parabéns pela dedicação. Cada minuto conta para a sua fluência.' 
            : `Faltam ${Math.max(0, todayGoalMinutes - todayStudiedMinutes)} minutos para atingir a meta diária planejada.`}
        </p>
      </section>

      {/* 2. Primary Progress Card with Circular Ring */}
      <section className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between gap-4">
          <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-slate-100 dark:stroke-slate-800"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                className={isTodayGoalAchieved ? 'stroke-emerald-500' : 'stroke-blue-600'}
                strokeWidth="8"
                strokeDasharray={2 * Math.PI * 40}
                strokeDashoffset={2 * Math.PI * 40 * (1 - todayProgressPercentage / 100)}
                strokeLinecap="round"
                fill="none"
                style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">
                {todayProgressPercentage}%
              </span>
              <span className="text-[10px] text-slate-400 font-medium -mt-0.5">concluído</span>
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <div>
              <div className="text-xs text-slate-500">Tempo de estudo hoje</div>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                  {todayStudiedMinutes}
                </span>
                <span className="text-xs text-slate-500 tabular-nums">
                  / {todayGoalMinutes} min
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>Sequência: <strong className="tabular-nums">{streak.currentStreak} dias</strong></span>
              </div>
              <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                <Shield className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
                <span>Tokens: <strong className="tabular-nums">{streak.restTokensAvailable}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Primary Action: Next Recommended Activity */}
      {nextRecommendedTask && (
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Próxima Atividade Recomendada
            </span>
            <span className="text-xs text-blue-600 font-medium">Recomendação do plano</span>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-md shadow-blue-500/15 relative overflow-hidden">
            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-[11px] font-semibold bg-white/20 backdrop-blur-xs rounded-full">
                    {SKILL_METADATA[nextRecommendedTask.skill]?.label || nextRecommendedTask.skill}
                  </span>
                  <span className="text-xs text-blue-100 flex items-center gap-1 tabular-nums">
                    <Clock className="w-3 h-3" />
                    {nextRecommendedTask.estimatedMinutes} min planejados
                  </span>
                </div>

                <span className="text-[11px] font-medium text-blue-200">
                  {nextRecommendedTask.status === 'in_progress' ? 'Em andamento' : 'Pendente'}
                </span>
              </div>

              <div>
                <h2 className="text-lg font-bold leading-snug">
                  {nextRecommendedTask.title}
                </h2>
                <p className="text-xs text-blue-100 mt-1 line-clamp-2">
                  {nextRecommendedTask.subtitle}
                </p>
              </div>

              <button
                onClick={() => startTask(nextRecommendedTask.id)}
                className="w-full min-h-[46px] rounded-xl bg-white text-blue-700 font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-50 active:scale-[0.99] transition-all shadow-sm"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>
                  {nextRecommendedTask.status === 'in_progress' ? 'Retomar Sessão' : 'Iniciar Atividade Agora'}
                </span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 4. Today's Mission Tasks List */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Missões Programadas de Hoje
          </h2>
          <span className="text-xs text-slate-500 tabular-nums">
            {todayTasks.filter(t => t.status === 'completed').length}/{todayTasks.length} concluídas
          </span>
        </div>

        <div className="space-y-2">
          {todayTasks.map((task) => {
            const isCompleted = task.status === 'completed';
            const isInProgress = task.status === 'in_progress';
            const skillInfo = SKILL_METADATA[task.skill] || SKILL_METADATA.listening;
            const Icon = skillInfo.icon;

            return (
              <div
                key={task.id}
                onClick={() => startTask(task.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isCompleted
                    ? 'bg-slate-50/80 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/80 opacity-80'
                    : isInProgress
                    ? 'bg-blue-50/50 dark:bg-blue-950/30 border-blue-300 dark:border-blue-800'
                    : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${skillInfo.colorBg} ${skillInfo.colorText}`}>
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-0.5">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{skillInfo.label}</span>
                    <span>·</span>
                    <span className="tabular-nums">{task.estimatedMinutes} min</span>
                    {task.actualMinutesElapsed > 0 && (
                      <>
                        <span>·</span>
                        <span className="tabular-nums text-blue-600 font-medium">
                          {task.actualMinutesElapsed} min reais
                        </span>
                      </>
                    )}
                  </div>
                  <h3 className={`text-xs font-bold truncate ${isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                    {task.title}
                  </h3>
                </div>

                <div className="shrink-0">
                  {isCompleted ? (
                    <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  ) : (
                    <button
                      className="min-h-[36px] px-3 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        startTask(task.id);
                      }}
                    >
                      <span>{isInProgress ? 'Continuar' : 'Praticar'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Quick Shortcut Cards to Routine and Progress */}
      <section className="grid grid-cols-2 gap-2.5 pt-1">
        <button
          onClick={() => navigateTo('routine')}
          className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-left hover:border-blue-400 transition-colors group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-0.5" />
          </div>
          <div className="text-xs font-bold text-slate-900 dark:text-white">Rotina Semanal</div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Ver grade dos 7 dias e habilidades
          </p>
        </button>

        <button
          onClick={() => navigateTo('progress')}
          className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-left hover:border-blue-400 transition-colors group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-transform group-hover:translate-x-0.5" />
          </div>
          <div className="text-xs font-bold text-slate-900 dark:text-white">Consistência</div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Histórico, gráficos e tokens
          </p>
        </button>
      </section>
    </div>
  );
};
