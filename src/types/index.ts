export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type StudyGoal = 
  | 'conversation' 
  | 'career' 
  | 'academic' 
  | 'travel' 
  | 'general';

export type SkillType = 
  | 'listening' 
  | 'reading' 
  | 'speaking' 
  | 'writing' 
  | 'vocabulary' 
  | 'grammar';

export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export interface TaskExercise {
  type: SkillType;
  prompt: string;
  contextText?: string;
  guidePoints: string[];
  vocabularyList?: { word: string; translation: string; context: string }[];
  comprehensionQuestion?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  sampleAudioTitle?: string;
  sampleAudioDuration?: string;
}

export interface Task {
  id: string;
  dayIndex: number; // 0 = Seg, 1 = Ter, ... 6 = Dom
  dayName: string;
  skill: SkillType;
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  actualMinutesElapsed: number;
  status: TaskStatus;
  completedAt?: string;
  exercise: TaskExercise;
}

export interface UserProfile {
  name: string;
  level: CEFRLevel;
  goal: StudyGoal;
  dailyMinutesGoal: number; // 15, 25, 45, 60
  weeklyDaysGoal: number; // 3, 4, 5, 6, 7
  onboardingCompleted: boolean;
  startDate: string;
}

export interface DayRecord {
  date: string; // YYYY-MM-DD
  dayOfWeek: string; // Seg, Ter, ...
  dayIndex: number;
  minutesPlanned: number;
  minutesStudied: number;
  goalMet: boolean;
  restTokenUsed: boolean;
  tasksCompletedCount: number;
}

export interface RestTokenTransaction {
  id: string;
  type: 'earned' | 'used';
  date: string;
  reason: string;
  targetDate?: string;
}

export interface StreakState {
  currentStreak: number;
  longestStreak: number;
  consecutiveGoalDays: number; // counts towards the next token (every 6 days)
  restTokensAvailable: number;
  totalTokensEarned: number;
  totalTokensUsed: number;
  history: RestTokenTransaction[];
}

export interface AppState {
  profile: UserProfile;
  tasks: Task[];
  history: DayRecord[];
  streak: StreakState;
  activeTaskId: string | null;
  activeScreen: 'dashboard' | 'routine' | 'session' | 'progress';
}
