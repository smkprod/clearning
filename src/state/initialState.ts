import type { AppState, Flashcard, Task } from '../types';
import {
  CURRICULUM_CHALLENGES,
  CURRICULUM_FLASHCARDS,
  CURRICULUM_MILESTONES,
  CURRICULUM_TASKS,
  DEFAULT_DAILY_GOAL_MIN,
  DEFAULT_EXAM_DATE,
  DEFAULT_MIN_DAY_MIN,
} from '../data/curriculum';
import { todayStr } from '../utils/date';

export function createInitialState(): AppState {
  const today = todayStr();
  return {
    createdAt: today,
    examDate: DEFAULT_EXAM_DATE,
    dailyGoalMin: DEFAULT_DAILY_GOAL_MIN,
    minDayMin: DEFAULT_MIN_DAY_MIN,
    tasks: CURRICULUM_TASKS.map((t) => ({ ...t, done: false, doneDate: null })),
    flashcards: CURRICULUM_FLASHCARDS.map((f) => ({ ...f, box: 1, nextReview: today })),
    challenges: CURRICULUM_CHALLENGES.map((c) => ({ ...c, solved: false })),
    milestones: CURRICULUM_MILESTONES.map((m) => ({ ...m, done: false })),
    applications: [],
    logs: {},
  };
}

/**
 * Приводит сохранённое состояние к актуальному виду: если программа в
 * curriculum.ts пополнилась новыми задачами/карточками/челленджами, они
 * дописываются в конец, не трогая прогресс пользователя.
 */
export function hydrateState(raw: unknown): AppState {
  const fresh = createInitialState();
  if (typeof raw !== 'object' || raw === null || !Array.isArray((raw as AppState).tasks)) {
    return fresh;
  }
  const stored = raw as AppState;

  const mergeById = <T extends { id: string }>(existing: T[], seeded: T[]): T[] => {
    const known = new Set(existing.map((x) => x.id));
    return [...existing, ...seeded.filter((s) => !known.has(s.id))];
  };

  return {
    ...fresh,
    ...stored,
    tasks: mergeById<Task>(stored.tasks ?? [], fresh.tasks),
    flashcards: mergeById<Flashcard>(stored.flashcards ?? [], fresh.flashcards),
    challenges: mergeById(stored.challenges ?? [], fresh.challenges),
    milestones: mergeById(stored.milestones ?? [], fresh.milestones),
    applications: stored.applications ?? [],
    logs: stored.logs ?? {},
  };
}
