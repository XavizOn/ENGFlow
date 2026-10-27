import React, { useState } from 'react';
import { 
  Flame, 
  Shield, 
  Calendar, 
  ShieldCheck,
  History
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SKILL_METADATA } from './common/SkillBadge';
import { SkillType } from '../types';

export const ProgressScreen: React.FC = () => {
  const { state, useRestToken } = useApp();
  const { history, streak, tasks } = state;

  const [selectedDateToProtect, setSelectedDateToProtect] = useState<string>('');
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [showTokenModal, setShowTokenModal] = useState<boolean>(false);

  const totalMinutesStudied = history.reduce((acc, h) => acc + h.minutesStudied, 0);
  const totalHours = Math.floor(totalMinutesStudied / 60);
  const remainingMins = totalMinutesStudied % 60;

  const totalTasksCompleted = tasks.filter(t => t.status === 'completed').length;
  const daysGoalMetCount = history.filter(h => h.goalMet).length;
  const consistencyRate = Math.round((daysGoalMetCount / Math.max(1, history.length)) * 100);

  const skillDurations: Record<SkillType, number> = {
    listening: 0,
    reading: 0,
    speaking: 0,
    writing: 0,
    vocabulary: 0,
    grammar: 0
  };

  tasks.forEach(t => {
    const mins = t.status === 'completed' ? (t.actualMinutesElapsed || t.estimatedMinutes) : 0;
    if (skillDurations[t.skill] !== undefined) {
      skillDurations[t.skill] += mins;
    }
  });

  const totalTrackedSkillMinutes = Object.values(skillDurations).reduce((a, b) => a + b, 0) || 1;

  const todayDate = history[history.length - 1]?.date;
  const eligibleMissedDays = history.filter(
    h => !h.goalMet && !h.restTokenUsed && h.date !== todayDate
  );

  const handleApplyToken = () => {
    if (!selectedDateToProtect) {
      setFeedbackMessage({ text: 'Por favor, selecione uma data para proteger.', isError: true });
      return;
    }

    const res = useRestToken(selectedDateToProtect, 'Proteção manual de sequência na demonstração');
    setFeedbackMessage({ text: res.message, isError: !res.success });
    if (res.success) {
      setSelectedDateToProtect('');
    }
  };

  return (
    <div className="space-y-5 pb-8">
      {/* Top Header */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Métricas de Aprendizado
        </span>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
          Progresso & Consistência
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Evolução real baseada no cumprimento de metas e frequência de estudo.
        </p>
      </div>

      {/* 1. Primary Summary KPI Strip */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center">
          <div className="text-xs text-slate-500">Tempo Total</div>
          <div className="text-lg font-extrabold text-blue-600 dark:text-blue-400 mt-1 tabular-nums">
            {totalHours}h {remainingMins}m
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">horas de foco</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center">
          <div className="text-xs text-slate-500">Sessões</div>
          <div className="text-lg font-extrabold text-slate-900 dark:text-white mt-1 tabular-nums">
            {totalTasksCompleted}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">concluídas</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center">
          <div className="text-xs text-slate-500">Consistência</div>
          <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
            {consistencyRate}%
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">dias com meta</div>
        </div>
      </div>

      {/* 2. Streak & Rest Token Mechanics Card */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
              <Flame className="w-5 h-5 fill-amber-500 text-amber-500" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                Sequência Atual: <span className="tabular-nums text-amber-600 font-extrabold">{streak.currentStreak} dias</span>
              </div>
              <div className="text-[11px] text-slate-500">
                Recorde histórico: <span className="tabular-nums font-semibold">{streak.longestStreak} dias</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 text-emerald-700 dark:text-emerald-400">
            <Shield className="w-4 h-4 fill-emerald-500 text-emerald-500" />
            <span className="text-xs font-bold tabular-nums">{streak.restTokensAvailable} Tokens</span>
          </div>
        </div>

        {/* Progress towards NEXT token */}
        <div className="space-y-1.5 pt-1 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-400">Progresso rumo ao próximo Token:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 tabular-nums">
              {(streak.consecutiveGoalDays % 6)}/6 dias cumpridos
            </span>
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${((streak.consecutiveGoalDays % 6) / 6) * 100}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-500">
            Regra do EngFlow: A cada 6 dias de meta cumprida, você ganha 1 Token de Descanso para proteger um dia sem quebrar a sequência.
          </p>
        </div>

        {/* Action button to use token */}
        <div className="pt-1">
          <button
            onClick={() => setShowTokenModal(true)}
            className="w-full min-h-[42px] rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-emerald-100 transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Gerenciar e Aplicar Token de Descanso</span>
          </button>
        </div>
      </div>

      {/* 3. Weekly History Bar Chart (Planned vs Studied) */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span>Histórico dos Últimos 7 Dias</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-blue-600 rounded-xs" /> Realizado
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-slate-200 dark:bg-slate-700 rounded-xs" /> Meta
            </span>
          </div>
        </div>

        {/* Bar chart grid */}
        <div className="h-36 flex items-end justify-between gap-2 pt-6 pb-2 px-1 border-b border-slate-100 dark:border-slate-800">
          {history.map((record) => {
            const maxRefMinutes = 40;
            const studiedHeight = Math.min(100, Math.round((record.minutesStudied / maxRefMinutes) * 100));
            const goalHeight = Math.min(100, Math.round((record.minutesPlanned / maxRefMinutes) * 100));

            return (
              <div key={record.date} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                <div className="w-full flex items-end justify-center gap-1 h-24">
                  <div 
                    className="w-2 bg-slate-200 dark:bg-slate-700 rounded-t-sm"
                    style={{ height: `${goalHeight}%` }}
                  />

                  <div 
                    className={`w-2.5 rounded-t-sm transition-all duration-300 ${
                      record.goalMet 
                        ? 'bg-blue-600' 
                        : record.restTokenUsed 
                        ? 'bg-emerald-500' 
                        : 'bg-amber-400'
                    }`}
                    style={{ height: `${Math.max(4, studiedHeight)}%` }}
                  />
                </div>

                <span className="text-[10px] font-semibold text-slate-500 mt-2">
                  {record.dayOfWeek}
                </span>

                <div className="mt-0.5 h-3">
                  {record.goalMet ? (
                    <span className="text-[10px] text-emerald-500 font-bold">✓</span>
                  ) : record.restTokenUsed ? (
                    <span title="Protegido por Token">
                      <Shield className="w-2.5 h-2.5 text-emerald-500 fill-emerald-500" />
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400">·</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Skill Distribution Breakdown */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
        <div className="text-xs font-bold text-slate-900 dark:text-white">
          Tempo Praticado por Habilidade
        </div>

        <div className="space-y-2.5">
          {(['listening', 'reading', 'speaking', 'writing'] as SkillType[]).map((skill) => {
            const mins = skillDurations[skill] || 15;
            const meta = SKILL_METADATA[skill];
            const Icon = meta.icon;
            const percentage = Math.round((mins / totalTrackedSkillMinutes) * 100);

            return (
              <div key={skill} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                    <Icon className={`w-3.5 h-3.5 ${meta.colorText}`} />
                    <span>{meta.label}</span>
                  </div>
                  <div className="text-slate-500 tabular-nums">
                    <strong>{mins} min</strong> ({percentage}%)
                  </div>
                </div>

                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%`, backgroundColor: meta.hex }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal: Token Management & Protection */}
      {showTokenModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-5 space-y-4 shadow-xl border border-slate-200 dark:border-slate-800 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Tokens de Descanso
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowTokenModal(false);
                  setFeedbackMessage(null);
                }}
                className="text-xs text-slate-500 hover:text-slate-900 font-semibold p-1"
              >
                Fechar
              </button>
            </div>

            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-xs text-emerald-900 dark:text-emerald-300 flex items-center justify-between">
              <span>Saldo disponível:</span>
              <span className="font-extrabold text-base tabular-nums">
                {streak.restTokensAvailable} Token(s)
              </span>
            </div>

            <div className="text-[11px] text-slate-500 space-y-1 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl leading-relaxed">
              <div className="font-semibold text-slate-700 dark:text-slate-300">Como funciona a regra:</div>
              <p>• Ganhe 1 token a cada 6 dias de meta diária cumprida.</p>
              <p>• Proteja um dia em que não conseguiu estudar para não zerar sua sequência.</p>
              <p>• Cada token é de uso único e o saldo nunca fica negativo.</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                Selecione um dia sem meta para proteger:
              </label>

              {eligibleMissedDays.length === 0 ? (
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-500 text-center">
                  Nenhum dia pendente elegível para proteção no histórico recente.
                </div>
              ) : (
                <div className="space-y-1.5">
                  {eligibleMissedDays.map((day) => (
                    <button
                      key={day.date}
                      onClick={() => setSelectedDateToProtect(day.date)}
                      className={`w-full text-left p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                        selectedDateToProtect === day.date
                          ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 font-bold'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span>{day.date} ({day.dayOfWeek})</span>
                      <span className="text-slate-500 font-normal">
                        {day.minutesStudied}m / {day.minutesPlanned}m
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {feedbackMessage && (
                <div className={`p-2.5 rounded-lg text-xs ${feedbackMessage.isError ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>
                  {feedbackMessage.text}
                </div>
              )}

              <button
                disabled={streak.restTokensAvailable <= 0 || !selectedDateToProtect}
                onClick={handleApplyToken}
                className="w-full min-h-[44px] rounded-xl bg-emerald-600 disabled:opacity-50 text-white font-bold text-xs hover:bg-emerald-700 transition-colors"
              >
                Confirmar Proteção com Token
              </button>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                <History className="w-3.5 h-3.5" />
                <span>Histórico de Transações de Tokens:</span>
              </div>

              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                {streak.history.map((tx) => (
                  <div key={tx.id} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 text-[11px] flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200">
                        {tx.type === 'earned' ? 'Token Conquistado' : 'Token Utilizado'}
                      </div>
                      <div className="text-slate-500 text-[10px]">{tx.reason}</div>
                    </div>
                    <span className="text-slate-400 tabular-nums text-[10px]">{tx.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
