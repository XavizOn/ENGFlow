import { AppState, UserProfile, DayRecord, RestTokenTransaction, Task } from '../types';
import { generateWeeklyTasks, DAY_NAMES } from './routineGenerator';

const STORAGE_KEY = 'engflow_app_state_v1';

export function getTodayDateString(): string {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

export function getDefaultAppState(): AppState {
  const profile: UserProfile = {
    name: 'Lucas Ferreira',
    level: 'B1',
    goal: 'career',
    dailyMinutesGoal: 25,
    weeklyDaysGoal: 5,
    onboardingCompleted: true,
    startDate: '2026-10-20'
  };

  const tasks = generateWeeklyTasks(
    profile.level,
    profile.goal,
    profile.dailyMinutesGoal,
    profile.weeklyDaysGoal
  );

  const history: DayRecord[] = [
    {
      date: '2026-10-21',
      dayOfWeek: 'Qua',
      dayIndex: 2,
      minutesPlanned: 25,
      minutesStudied: 30,
      goalMet: true,
      restTokenUsed: false,
      tasksCompletedCount: 2
    },
    {
      date: '2026-10-22',
      dayOfWeek: 'Qui',
      dayIndex: 3,
      minutesPlanned: 25,
      minutesStudied: 25,
      goalMet: true,
      restTokenUsed: false,
      tasksCompletedCount: 2
    },
    {
      date: '2026-10-23',
      dayOfWeek: 'Sex',
      dayIndex: 4,
      minutesPlanned: 25,
      minutesStudied: 28,
      goalMet: true,
      restTokenUsed: false,
      tasksCompletedCount: 2
    },
    {
      date: '2026-10-24',
      dayOfWeek: 'Sáb',
      dayIndex: 5,
      minutesPlanned: 0,
      minutesStudied: 0,
      goalMet: false,
      restTokenUsed: false,
      tasksCompletedCount: 0
    },
    {
      date: '2026-10-25',
      dayOfWeek: 'Dom',
      dayIndex: 6,
      minutesPlanned: 0,
      minutesStudied: 15,
      goalMet: false,
      restTokenUsed: false,
      tasksCompletedCount: 1
    },
    {
      date: '2026-10-26',
      dayOfWeek: 'Seg',
      dayIndex: 0,
      minutesPlanned: 25,
      minutesStudied: 25,
      goalMet: true,
      restTokenUsed: false,
      tasksCompletedCount: 2
    },
    {
      date: '2026-10-27',
      dayOfWeek: 'Ter',
      dayIndex: 1,
      minutesPlanned: 25,
      minutesStudied: 10,
      goalMet: false,
      restTokenUsed: false,
      tasksCompletedCount: 1
    }
  ];

  const tuesdayTasks = tasks.filter(t => t.dayIndex === 1);
  if (tuesdayTasks.length > 0) {
    tuesdayTasks[0].status = 'completed';
    tuesdayTasks[0].actualMinutesElapsed = 10;
    tuesdayTasks[0].completedAt = new Date().toISOString();
  }

  const initialTokenTransactions: RestTokenTransaction[] = [
    {
      id: 'tx-init-1',
      type: 'earned',
      date: '2026-10-24',
      reason: 'Conquista: 6 dias com meta diária cumprida'
    }
  ];

  return {
    profile,
    tasks,
    history,
    streak: {
      currentStreak: 4,
      longestStreak: 8,
      consecutiveGoalDays: 5,
      restTokensAvailable: 1,
      totalTokensEarned: 1,
      totalTokensUsed: 0,
      history: initialTokenTransactions
    },
    activeTaskId: null,
    activeScreen: 'dashboard'
  };
}

export function loadAppState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getDefaultAppState();
      saveAppState(initial);
      return initial;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load state from localStorage:', err);
    return getDefaultAppState();
  }
}

export function saveAppState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save state to localStorage:', err);
  }
}

export function resetAppState(startFreshOnboarding: boolean = false): AppState {
  const fresh = getDefaultAppState();
  if (startFreshOnboarding) {
    fresh.profile.onboardingCompleted = false;
    fresh.tasks.forEach(t => {
      t.status = 'pending';
      t.actualMinutesElapsed = 0;
    });
    fresh.streak.currentStreak = 0;
    fresh.streak.consecutiveGoalDays = 0;
    fresh.streak.restTokensAvailable = 0;
    fresh.streak.totalTokensEarned = 0;
    fresh.streak.totalTokensUsed = 0;
    fresh.streak.history = [];
    fresh.history[fresh.history.length - 1].minutesStudied = 0;
    fresh.history[fresh.history.length - 1].tasksCompletedCount = 0;
    fresh.history[fresh.history.length - 1].goalMet = false;
  }
  saveAppState(fresh);
  return fresh;
}
