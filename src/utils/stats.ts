import type { AppState, DayLog } from '../types';
import { addDays, diffDays } from './date';

/**
 * Стрик: подряд идущие дни с минутами >= minDayMin. Сегодняшний день без
 * минут стрик не ломает (день ещё не кончился) — отсчёт тогда идёт со вчера.
 */
export function studyStreak(logs: Record<string, DayLog>, minDayMin: number, today: string): number {
  const counts = (d: string) => (logs[d]?.minutes ?? 0) >= minDayMin;
  let day = counts(today) ? today : addDays(today, -1);
  let streak = 0;
  while (counts(day)) {
    streak += 1;
    day = addDays(day, -1);
  }
  return streak;
}

/** Стрик код-челленджей: дни, в лог которых записан решённый челлендж (id "ch-*"). */
export function challengeStreak(logs: Record<string, DayLog>, today: string): number {
  const counts = (d: string) => (logs[d]?.completedTaskIds ?? []).some((id) => id.startsWith('ch-'));
  let day = counts(today) ? today : addDays(today, -1);
  let streak = 0;
  while (counts(day)) {
    streak += 1;
    day = addDays(day, -1);
  }
  return streak;
}

export function totalMinutes(logs: Record<string, DayLog>): number {
  return Object.values(logs).reduce((sum, l) => sum + l.minutes, 0);
}

export function weekMinutes(logs: Record<string, DayLog>, today: string): number {
  let sum = 0;
  for (let i = 0; i < 7; i++) sum += logs[addDays(today, -i)]?.minutes ?? 0;
  return sum;
}

export interface ExamPace {
  daysLeft: number;
  total: number;
  done: number;
  expected: number;
  /** отставание в задачах; <= 0 значит в графике */
  behindBy: number;
  onTrack: boolean;
}

/**
 * «В графике / отстаёшь» по треку exam: сколько экзаменационных задач должно
 * быть закрыто к сегодняшнему дню при равномерном темпе от createdAt до examDate.
 */
export function examPace(state: AppState, today: string): ExamPace {
  const examTasks = state.tasks.filter((t) => t.track === 'exam');
  const total = examTasks.length;
  const done = examTasks.filter((t) => t.done).length;
  const daysLeft = Math.max(0, diffDays(today, state.examDate));
  const totalDays = Math.max(1, diffDays(state.createdAt, state.examDate));
  const elapsed = Math.min(totalDays, Math.max(0, diffDays(state.createdAt, today)));
  const expected = Math.min(total, Math.floor((total * elapsed) / totalDays));
  const behindBy = expected - done;
  return { daysLeft, total, done, expected, behindBy, onTrack: behindBy <= 0 };
}

export function jobReadinessPercent(state: AppState): number {
  if (state.milestones.length === 0) return 0;
  const done = state.milestones.filter((m) => m.done).length;
  return Math.round((done / state.milestones.length) * 100);
}
