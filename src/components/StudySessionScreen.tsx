import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  CheckCircle2, 
  RotateCcw, 
  X, 
  AlertCircle, 
  Volume2, 
  Mic, 
  BookOpen, 
  PenTool, 
  Flame, 
  ShieldCheck, 
  HelpCircle,
  Sparkles,
  ArrowRight,
  AudioLines
} from 'lucide-react';
import { triggerCelebration } from '../utils/confetti';
import { useApp } from '../context/AppContext';
import { SKILL_METADATA } from './common/SkillBadge';
import { Task } from '../types';

export const StudySessionScreen: React.FC = () => {
  const { 
    state, 
    activeTask, 
    completeTaskSession, 
    navigateTo, 
    startTask 
  } = useApp();

  // If no active task is selected, pick the first pending task of today
  const targetTask: Task | null = activeTask || 
    state.tasks.find(t => t.dayIndex === 1 && t.status !== 'completed') || 
    state.tasks[0] || null;

  // Timer states
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [showExitModal, setShowExitModal] = useState<boolean>(false);
  const [isCompletedModalOpen, setIsCompletedModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [earnedTokenInSession, setEarnedTokenInSession] = useState<boolean>(false);
  const [goalMetInSession, setGoalMetInSession] = useState<boolean>(false);

  // Exercise interaction states
  const [showTranscript, setShowTranscript] = useState<boolean>(false);
  const [isPlayingSimulatedAudio, setIsPlayingSimulatedAudio] = useState<boolean>(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [isRecordingSpeaking, setIsRecordingSpeaking] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [userWritingText, setUserWritingText] = useState<string>('');

  // Robust temporal references to calculate real elapsed time
  const startTimeRef = useRef<number>(Date.now());
  const pausedAccumulatedRef = useRef<number>(0);
  const pauseStartRef = useRef<number | null>(null);

  // Timer tick effect
  useEffect(() => {
    let intervalId: any = null;

    if (isRunning) {
      intervalId = setInterval(() => {
        const now = Date.now();
        const totalElapsedMs = (now - startTimeRef.current) - pausedAccumulatedRef.current;
        setElapsedSeconds(Math.max(0, Math.floor(totalElapsedMs / 1000)));
      }, 500);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isRunning]);

  // Speaking simulation timer
  useEffect(() => {
    let recInterval: any = null;
    if (isRecordingSpeaking) {
      recInterval = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (recInterval) clearInterval(recInterval);
    };
  }, [isRecordingSpeaking]);

  const handlePauseResume = () => {
    if (isRunning) {
      // Transition to paused
      pauseStartRef.current = Date.now();
      setIsRunning(false);
      setIsPlayingSimulatedAudio(false);
      setIsRecordingSpeaking(false);
    } else {
      // Resume
      if (pauseStartRef.current) {
        pausedAccumulatedRef.current += (Date.now() - pauseStartRef.current);
        pauseStartRef.current = null;
      }
      setIsRunning(true);
    }
  };

  const handleCompleteSession = () => {
    if (!targetTask || isSubmitting) return;

    setIsSubmitting(true);
    setIsRunning(false);
    setIsPlayingSimulatedAudio(false);
    setIsRecordingSpeaking(false);

    // Calculate actual elapsed minutes (minimum 1 minute recorded for demonstration)
    const effectiveMinutes = Math.max(1, Math.ceil(elapsedSeconds / 60));

    // Execute state update with streak and rest token business logic
    const result = completeTaskSession(targetTask.id, effectiveMinutes);
    setEarnedTokenInSession(result.earnedNewToken);
    setGoalMetInSession(result.goalMetNow);

    // Launch celebratory confetti
    try {
      triggerCelebration();
    } catch {
      // graceful fallback
    }

    setIsCompletedModalOpen(true);
  };

  const handleConfirmExit = () => {
    setShowExitModal(false);
    navigateTo('dashboard');
  };

  if (!targetTask) {
    return (
      <div className="p-8 text-center space-y-3">
        <h2 className="text-base font-bold text-slate-800 dark:text-white">Nenhuma atividade selecionada</h2>
        <button
          onClick={() => navigateTo('dashboard')}
          className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
        >
          Voltar ao Dashboard
        </button>
      </div>
    );
  }

  const skillInfo = SKILL_METADATA[targetTask.skill] || SKILL_METADATA.listening;
  const SkillIcon = skillInfo.icon;
  const plannedSeconds = targetTask.estimatedMinutes * 60;
  const progressRatio = Math.min(1, elapsedSeconds / plannedSeconds);

  // Format MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const exercise = targetTask.exercise;

  return (
    <div className="space-y-4 pb-12">
      {/* Top Session Navigation & Exit trigger */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowExitModal(true)}
          className="min-h-[40px] px-2.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors"
          title="Abandonar sessão"
        >
          <X className="w-4 h-4" />
          <span>Abandonar</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
          <SkillIcon className={`w-4 h-4 ${skillInfo.colorText}`} />
          <span>{skillInfo.label}</span>
        </div>

        <div className="text-xs font-semibold text-slate-500 tabular-nums">
          Meta: {targetTask.estimatedMinutes} min
        </div>
      </div>

      {/* Main Timer Display Card */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-3 shadow-xs">
        <div className="text-xs font-medium text-slate-500">
          {isRunning ? 'Tempo de concentração em curso' : 'Sessão em pausa'}
        </div>

        {/* Digital Clock with Tabular Numerals */}
        <div className="text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white font-mono tabular-nums">
          {formatTime(elapsedSeconds)}
        </div>

        {/* Progress bar towards planned duration */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-300 rounded-full ${
              elapsedSeconds >= plannedSeconds ? 'bg-emerald-500' : 'bg-blue-600'
            }`}
            style={{ width: `${Math.min(100, Math.round(progressRatio * 100))}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <span>00:00</span>
          <span className="tabular-nums font-medium">
            {elapsedSeconds >= plannedSeconds 
              ? 'Tempo planejado alcançado!' 
              : `${Math.round(progressRatio * 100)}% do planejado`}
          </span>
          <span className="tabular-nums">{formatTime(plannedSeconds)}</span>
        </div>

        {/* Timer Control Buttons */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={handlePauseResume}
            className={`min-h-[46px] px-5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              isRunning
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pausar</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Retomar</span>
              </>
            )}
          </button>

          <button
            onClick={handleCompleteSession}
            disabled={isSubmitting}
            className="min-h-[46px] px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm active:scale-[0.98] transition-transform"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Concluir Sessão</span>
          </button>
        </div>
      </div>

      {/* Task Information & Exercise Workspace */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div>
          <div className="text-xs font-semibold text-blue-600 dark:text-blue-400">
            Objetivo da Sessão
          </div>
          <h1 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
            {targetTask.title}
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            {exercise.prompt}
          </p>
        </div>

        {/* Dynamic Exercise Interactivity by Skill */}
        {targetTask.skill === 'listening' && (
          <div className="p-4 rounded-xl bg-sky-50/60 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-sky-900 dark:text-sky-300 flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-sky-600" />
                {exercise.sampleAudioTitle || 'Áudio da Lição'}
              </span>
              <span className="text-[11px] font-mono text-sky-700 dark:text-sky-400">
                {exercise.sampleAudioDuration || '02:30'}
              </span>
            </div>

            {/* Simulated Audio Player Controls */}
            <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-sky-200/60 dark:border-sky-800">
              <button
                onClick={() => setIsPlayingSimulatedAudio(!isPlayingSimulatedAudio)}
                className="w-8 h-8 rounded-full bg-sky-600 text-white flex items-center justify-center shrink-0"
              >
                {isPlayingSimulatedAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
              </button>

              <div className="flex-1">
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                  <span>{isPlayingSimulatedAudio ? 'Reproduzindo...' : 'Pausado'}</span>
                  <span>Velocidade 1.0x</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className={`h-full bg-sky-600 rounded-full ${isPlayingSimulatedAudio ? 'w-2/3 animate-pulse' : 'w-1/4'}`} />
                </div>
              </div>
            </div>

            {/* Transcript Toggle */}
            <div className="pt-1">
              <button
                onClick={() => setShowTranscript(!showTranscript)}
                className="text-xs font-semibold text-sky-700 dark:text-sky-400 hover:underline"
              >
                {showTranscript ? 'Ocultar Transcrição' : 'Ver Transcrição do Áudio'}
              </button>

              {showTranscript && exercise.contextText && (
                <div className="mt-2 p-3 rounded-lg bg-white dark:bg-slate-900 border border-sky-100 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-serif whitespace-pre-line">
                  {exercise.contextText}
                </div>
              )}
            </div>

            {/* Comprehension Checkpoint */}
            {exercise.comprehensionQuestion && (
              <div className="mt-3 pt-3 border-t border-sky-100 dark:border-sky-900/40 space-y-2">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {exercise.comprehensionQuestion.question}
                </div>
                <div className="space-y-1.5">
                  {exercise.comprehensionQuestion.options.map((option, idx) => {
                    const isSelected = selectedAnswerIndex === idx;
                    const isCorrect = idx === exercise.comprehensionQuestion?.correctIndex;
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedAnswerIndex(idx)}
                        className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors border ${
                          isSelected
                            ? isCorrect
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : 'bg-rose-50 border-rose-500 text-rose-900 dark:bg-rose-950/60 dark:text-rose-300'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
                {selectedAnswerIndex !== null && (
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                    {exercise.comprehensionQuestion.explanation}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {targetTask.skill === 'speaking' && (
          <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40 space-y-3">
            <span className="text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
              <Mic className="w-4 h-4 text-amber-600" />
              Treino de Shadowing & Repetição
            </span>

            {exercise.contextText && (
              <blockquote className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-amber-200/60 text-xs text-slate-800 dark:text-slate-200 font-serif leading-relaxed italic">
                {exercise.contextText}
              </blockquote>
            )}

            {/* Speaking voice recorder simulation */}
            <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-amber-200/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsRecordingSpeaking(!isRecordingSpeaking)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isRecordingSpeaking 
                      ? 'bg-rose-600 text-white animate-pulse' 
                      : 'bg-amber-600 text-white'
                  }`}
                >
                  <Mic className="w-5 h-5" />
                </button>
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {isRecordingSpeaking ? 'Gravando sua fala...' : 'Gravação de Prática'}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {formatTime(recordingSeconds)} gravados
                  </div>
                </div>
              </div>

              {isRecordingSpeaking && (
                <div className="flex items-center gap-1">
                  <span className="w-1 h-3 bg-rose-500 rounded-full animate-bounce" />
                  <span className="w-1 h-5 bg-rose-500 rounded-full animate-bounce [animation-delay:0.1s]" />
                  <span className="w-1 h-4 bg-rose-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                </div>
              )}
            </div>
          </div>
        )}

        {targetTask.skill === 'reading' && (
          <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 space-y-3">
            <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              Trecho de Leitura Autêntica
            </span>

            {exercise.contextText && (
              <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-emerald-200/60 text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-serif whitespace-pre-line">
                {exercise.contextText}
              </div>
            )}

            {exercise.comprehensionQuestion && (
              <div className="pt-2 space-y-2">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {exercise.comprehensionQuestion.question}
                </div>
                <div className="space-y-1">
                  {exercise.comprehensionQuestion.options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedAnswerIndex(idx)}
                      className={`w-full text-left p-2 rounded-lg text-xs border ${
                        selectedAnswerIndex === idx
                          ? 'bg-emerald-100 border-emerald-600 text-emerald-900 font-semibold'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {targetTask.skill === 'writing' && (
          <div className="p-4 rounded-xl bg-violet-50/60 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-violet-900 dark:text-violet-300 flex items-center gap-1.5">
                <PenTool className="w-4 h-4 text-violet-600" />
                Campo de Produção Escrita
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                {userWritingText.trim().split(/\s+/).filter(Boolean).length} palavras
              </span>
            </div>

            <textarea
              rows={4}
              value={userWritingText}
              onChange={(e) => setUserWritingText(e.target.value)}
              placeholder="Escreva seu parágrafo em inglês aqui para praticar..."
              className="w-full p-3 rounded-lg border border-violet-200/80 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
        )}

        {/* Guide points & tips */}
        {exercise.guidePoints && exercise.guidePoints.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Diretrizes de Prática:
            </div>
            <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
              {exercise.guidePoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-blue-600 shrink-0 mt-0.5">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Vocabulary highlights */}
        {exercise.vocabularyList && exercise.vocabularyList.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Vocabulário em Destaque:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {exercise.vocabularyList.map((item, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs">
                  <div className="font-bold text-blue-700 dark:text-blue-400">{item.word}</div>
                  <div className="text-slate-600 dark:text-slate-300 text-[11px]">{item.translation}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal for Abandoning Session */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl p-5 space-y-4 shadow-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Deseja sair da sessão?
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Se você sair agora, o tempo de {formatTime(elapsedSeconds)} não será salvo na sua meta diária.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 pt-2">
              <button
                onClick={() => setShowExitModal(false)}
                className="flex-1 min-h-[44px] rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Continuar Estudando
              </button>
              <button
                onClick={handleConfirmExit}
                className="flex-1 min-h-[44px] rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700"
              >
                Abandonar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post-Completion Summary Modal */}
      {isCompletedModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 text-center space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                Sessão Concluída!
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                {targetTask.title}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Registrados <strong className="tabular-nums text-slate-800 dark:text-slate-200">{Math.max(1, Math.ceil(elapsedSeconds / 60))} minutos</strong> de estudo focado.
              </p>
            </div>

            {/* Achievements Banner */}
            <div className="space-y-2 text-left">
              {goalMetInSession && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 flex items-center gap-2.5">
                  <Flame className="w-5 h-5 text-amber-500 fill-amber-500 shrink-0" />
                  <div className="text-xs">
                    <div className="font-bold text-amber-900 dark:text-amber-300">
                      Meta diária de hoje cumprida!
                    </div>
                    <div className="text-amber-700 dark:text-amber-400 text-[11px]">
                      Sua sequência aumentou para {state.streak.currentStreak} dias!
                    </div>
                  </div>
                </div>
              )}

              {earnedTokenInSession && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div className="text-xs">
                    <div className="font-bold text-emerald-900 dark:text-emerald-300">
                      Você ganhou 1 Token de Descanso!
                    </div>
                    <div className="text-emerald-700 dark:text-emerald-400 text-[11px]">
                      Recompensa por atingir a meta em 6 dias consistentes.
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 space-y-2">
              <button
                onClick={() => {
                  setIsCompletedModalOpen(false);
                  navigateTo('dashboard');
                }}
                className="w-full min-h-[46px] rounded-xl bg-blue-600 text-white font-bold text-sm shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-colors"
              >
                Voltar ao Dashboard
              </button>

              <button
                onClick={() => {
                  setIsCompletedModalOpen(false);
                  navigateTo('routine');
                }}
                className="w-full min-h-[44px] rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-50 transition-colors"
              >
                Ver Grade da Rotina
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
