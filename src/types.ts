export type Track =
  | 'algo'
  | 'csharp'
  | 'backend'
  | 'sql'
  | 'tests'
  | 'devops'
  | 'exam'
  | 'job';

export type TaskType = 'practice' | 'theory' | 'project' | 'exam' | 'milestone';

export interface TaskLink {
  label: string;
  url: string;
}

export interface Task {
  id: string;
  track: Track;
  type: TaskType;
  title: string;
  detail: string; // что конкретно сделать
  links?: TaskLink[]; // теория/справка к задаче
  estMin: number;
  done: boolean;
  doneDate: string | null;
}

export interface Flashcard {
  id: string;
  track: Track;
  front: string; // вопрос
  back: string; // ответ
  box: number; // 1..5 (Leitner)
  nextReview: string; // YYYY-MM-DD
}

export interface DailyChallenge {
  id: string;
  title: string;
  link?: string; // LeetCode/Codewars
  difficulty: 'easy' | 'medium';
  solved: boolean;
}

export interface Milestone {
  id: string;
  label: string;
  done: boolean;
}

export type ApplicationStatus = 'applied' | 'interview' | 'offer' | 'rejected';

export interface Application {
  id: string;
  company: string;
  role: string;
  date: string;
  status: ApplicationStatus;
}

export interface DayLog {
  minutes: number;
  completedTaskIds: string[];
}

export interface AppState {
  createdAt: string;
  examDate: string; // '2026-11-25'
  dailyGoalMin: number; // 120
  minDayMin: number; // 30
  tasks: Task[];
  flashcards: Flashcard[];
  challenges: DailyChallenge[];
  milestones: Milestone[];
  applications: Application[];
  logs: Record<string, DayLog>; // 'YYYY-MM-DD' -> DayLog
}

export type CardRating = 'again' | 'hard' | 'good' | 'easy';

export const TRACK_LABELS: Record<Track, string> = {
  algo: 'Алгоритмы',
  csharp: 'C#',
  backend: 'Backend',
  sql: 'SQL',
  tests: 'Тесты',
  devops: 'DevOps',
  exam: 'Экзамен AP2',
  job: 'Работа',
};

export const TASK_TYPE_LABELS: Record<TaskType, string> = {
  practice: 'практика',
  theory: 'теория',
  project: 'проект',
  exam: 'экзамен',
  milestone: 'майлстоун',
};
