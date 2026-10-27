import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppState, UserProfile, Task, TaskStatus, RestTokenTransaction, DayRecord } from '../types';
import { loadAppState, saveAppState, resetAppState, getDefaultAppState } from '../utils/storage';
import { generateWeeklyTasks } from '../utils/routineGenerator';

interface AppContextType {
  state: AppState;
  activeTask: Task | null;
  navigateTo: (screen: AppState['activeScreen']) => void;
  startTask: (taskId: string) => void;
  completeTaskSession: (taskId: string, minutesSpent: number) => { earnedNewToken: boolean; goalMetNow: boolean };
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  useRestToken: (targetDate: string, reason?: string) => { success: boolean; message: string };
  completeOnboarding: (newProfile: Partial<UserProfile>) => void;
  resetDemoData: () => void;
  resetOnboarding: () => void;
  updateSettings: (newProfile: Partial<UserProfile>) => void;
  todayStudiedMinutes: number;
  todayGoalMinutes: number;
  todayProgressPercentage: number;
  todayTasks: Task[];
  nextRecommendedTask: Task | null;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => loadAppState());

  useEffect(() => {
    saveAppState(state);
  }, [state]);

  const activeTask = state.tasks.find(t => t.id === state.activeTaskId) || null;

  // Assuming Today is Tuesday (dayIndex 1 in our 0-indexed Mon=0...Sun=6 week)
  const todayDayIndex = 1;
  const todayTasks = state.tasks.filter(t => t.dayIndex === todayDayIndex);
  
  // Find current day record
  const currentDayRecord = state.history[state.history.length - 1];
  const todayStudiedMinutes = currentDayRecord ? currentDayRecord.minutesStudied : 0;
  const todayGoalMinutes = state.profile.dailyMinutesGoal;
  const todayProgressPercentage = Math.min(100, Math.round((todayStudiedMinutes / todayGoalMinutes) * 100));

  // Next recommended task: first non-completed today task
  const nextRecommendedTask = todayTasks.find(t => t.status !== 'completed') || todayTasks[0] || null;

  const navigateTo = (screen: AppState['activeScreen']) => {
    setState(prev => ({ ...prev, activeScreen: screen }));
  };

  const startTask = (taskId: string) => {
    setState(prev => {
      const updatedTasks = prev.tasks.map(t => {
        if (t.id === taskId && t.status === 'pending') {
          return { ...t, status: 'in_progress' as TaskStatus };
        }
        return t;
      });
      return {
        ...prev,
        tasks: updatedTasks,
        activeTaskId: taskId,
        activeScreen: 'session'
      };
    });
  };

  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    setState(prev => {
      const updatedTasks = prev.tasks.map(t => {
        if (t.id === taskId) {
          return {
            ...t,
            status,
            completedAt: status === 'completed' ? new Date().toISOString() : undefined
          };
        }
        return t;
      });
      return { ...prev, tasks: updatedTasks };
    });
  };

  const completeTaskSession = (taskId: string, minutesSpent: number) => {
    const effectiveMinutes = Math.max(1, Math.round(minutesSpent));
    let earnedNewToken = false;
    let goalMetNow = false;

    setState(prev => {
      const targetTask = prev.tasks.find(t => t.id === taskId);
      if (!targetTask) return prev;

      // Prevent duplicate completion calculation
      const wasAlreadyCompleted = targetTask.status === 'completed';
      const actualMinutesElapsed = wasAlreadyCompleted 
        ? targetTask.actualMinutesElapsed + effectiveMinutes 
        : effectiveMinutes;

      const updatedTasks = prev.tasks.map(t => {
        if (t.id === taskId) {
          return {
            ...t,
            status: 'completed' as TaskStatus,
            actualMinutesElapsed,
            completedAt: new Date().toISOString()
          };
        }
        return t;
      });

      // Update history for current day
      const updatedHistory = [...prev.history];
      const todayIndex = updatedHistory.length - 1;
      const todayRec = { ...updatedHistory[todayIndex] };

      const previousStudied = todayRec.minutesStudied;
      const newStudied = wasAlreadyCompleted 
        ? previousStudied + effectiveMinutes 
        : previousStudied + targetTask.estimatedMinutes;
      
      const wasGoalMet = todayRec.goalMet;
      const isGoalMet = newStudied >= prev.profile.dailyMinutesGoal;
      goalMetNow = !wasGoalMet && isGoalMet;

      todayRec.minutesStudied = newStudied;
      todayRec.goalMet = isGoalMet;
      todayRec.tasksCompletedCount = updatedTasks.filter(
        t => t.dayIndex === todayRec.dayIndex && t.status === 'completed'
      ).length;

      updatedHistory[todayIndex] = todayRec;

      // Update streak and rest token logic
      let currentStreak = prev.streak.currentStreak;
      let consecutiveGoalDays = prev.streak.consecutiveGoalDays;
      let restTokensAvailable = prev.streak.restTokensAvailable;
      let totalTokensEarned = prev.streak.totalTokensEarned;
      const tokenHistory = [...prev.streak.history];

      if (goalMetNow) {
        currentStreak += 1;
        consecutiveGoalDays += 1;

        // Business rule: Every 6 days of goal reached awards 1 rest token
        if (consecutiveGoalDays % 6 === 0) {
          restTokensAvailable += 1;
          totalTokensEarned += 1;
          earnedNewToken = true;

          const newTransaction: RestTokenTransaction = {
            id: `tx-earned-${Date.now()}`,
            type: 'earned',
            date: new Date().toISOString().split('T')[0],
            reason: `Recompensa por atingir a meta em 6 dias seguidos (Total: ${consecutiveGoalDays} dias)`
          };
          tokenHistory.unshift(newTransaction);
        }
      }

      return {
        ...prev,
        tasks: updatedTasks,
        history: updatedHistory,
        streak: {
          ...prev.streak,
          currentStreak,
          longestStreak: Math.max(prev.streak.longestStreak, currentStreak),
          consecutiveGoalDays,
          restTokensAvailable,
          totalTokensEarned,
          history: tokenHistory
        }
      };
    });

    return { earnedNewToken, goalMetNow };
  };

  const useRestToken = (targetDate: string, customReason?: string) => {
    if (state.streak.restTokensAvailable <= 0) {
      return { success: false, message: 'Você não possui tokens de descanso disponíveis no momento.' };
    }

    const dayRecord = state.history.find(h => h.date === targetDate);
    if (!dayRecord) {
      return { success: false, message: 'Dia selecionado não foi encontrado no histórico.' };
    }

    if (dayRecord.restTokenUsed) {
      return { success: false, message: 'Este dia já está protegido por um token de descanso.' };
    }

    if (dayRecord.goalMet) {
      return { success: false, message: 'A meta deste dia já foi cumprida! Não é necessário gastar um token.' };
    }

    // Apply token
    setState(prev => {
      const updatedHistory = prev.history.map(h => {
        if (h.date === targetDate) {
          return { ...h, restTokenUsed: true };
        }
        return h;
      });

      const tx: RestTokenTransaction = {
        id: `tx-used-${Date.now()}`,
        type: 'used',
        date: new Date().toISOString().split('T')[0],
        targetDate,
        reason: customReason || `Proteção de sequência para o dia ${targetDate}`
      };

      return {
        ...prev,
        history: updatedHistory,
        streak: {
          ...prev.streak,
          restTokensAvailable: Math.max(0, prev.streak.restTokensAvailable - 1),
          totalTokensUsed: prev.streak.totalTokensUsed + 1,
          history: [tx, ...prev.streak.history]
        }
      };
    });

    return { success: true, message: `Token de descanso aplicado com sucesso para proteger o dia ${targetDate}.` };
  };

  const completeOnboarding = (newProfile: Partial<UserProfile>) => {
    setState(prev => {
      const updatedProfile: UserProfile = {
        ...prev.profile,
        ...newProfile,
        onboardingCompleted: true
      };

      const regeneratedTasks = generateWeeklyTasks(
        updatedProfile.level,
        updatedProfile.goal,
        updatedProfile.dailyMinutesGoal,
        updatedProfile.weeklyDaysGoal
      );

      return {
        ...prev,
        profile: updatedProfile,
        tasks: regeneratedTasks,
        activeScreen: 'dashboard'
      };
    });
  };

  const updateSettings = (newProfile: Partial<UserProfile>) => {
    setState(prev => {
      const updatedProfile: UserProfile = {
        ...prev.profile,
        ...newProfile
      };

      // Regenerate routine if schedule/goal parameters changed
      const shouldRegenerate = 
        newProfile.level !== undefined || 
        newProfile.goal !== undefined || 
        newProfile.dailyMinutesGoal !== undefined || 
        newProfile.weeklyDaysGoal !== undefined;

      const updatedTasks = shouldRegenerate
        ? generateWeeklyTasks(
            updatedProfile.level,
            updatedProfile.goal,
            updatedProfile.dailyMinutesGoal,
            updatedProfile.weeklyDaysGoal
          )
        : prev.tasks;

      return {
        ...prev,
        profile: updatedProfile,
        tasks: updatedTasks
      };
    });
  };

  const resetDemoData = () => {
    const demo = getDefaultAppState();
    setState(demo);
  };

  const resetOnboarding = () => {
    const fresh = resetAppState(true);
    setState(fresh);
  };

  return (
    <AppContext.Provider
      value={{
        state,
        activeTask,
        navigateTo,
        startTask,
        completeTaskSession,
        updateTaskStatus,
        useRestToken,
        completeOnboarding,
        resetDemoData,
        resetOnboarding,
        updateSettings,
        todayStudiedMinutes,
        todayGoalMinutes,
        todayProgressPercentage,
        todayTasks,
        nextRecommendedTask
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
