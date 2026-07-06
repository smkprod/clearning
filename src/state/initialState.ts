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
 * Приводит сохранённое состояние к актуальному виду: новые задачи/карточки/
 * челленджи из curriculum.ts дописываются в конец, а у уже сохранённых
 * обновляется контент (заголовки, описания, ссылки) — прогресс пользователя
 * (done, боксы, даты, порядок очереди) при этом не трогается.
 */
export function hydrateState(raw: unknown): AppState {
  const fresh = createInitialState();
  if (typeof raw !== 'object' || raw === null || !Array.isArray((raw as AppState).tasks)) {
    return fresh;
  }
  const stored = raw as AppState;

  // контент берём из сида, прогресс (progressKeys) — из сохранённого
  const mergeById = <T extends { id: string }>(
    existing: T[],
    seeded: T[],
    progressKeys: (keyof T)[],
  ): T[] => {
    const seedById = new Map(seeded.map((s) => [s.id, s]));
    const refreshed = existing.map((item) => {
      const seed = seedById.get(item.id);
      if (!seed) return item; // пользовательский элемент — не трогаем
      const progress = Object.fromEntries(progressKeys.map((k) => [k, item[k]]));
      return { ...seed, ...progress };
    });
    const known = new Set(existing.map((x) => x.id));
    return [...refreshed, ...seeded.filter((s) => !known.has(s.id))];
  };

  return {
    ...fresh,
    ...stored,
    tasks: mergeById<Task>(stored.tasks ?? [], fresh.tasks, ['done', 'doneDate']),
    flashcards: mergeById<Flashcard>(stored.flashcards ?? [], fresh.flashcards, ['box', 'nextReview']),
    challenges: mergeById(stored.challenges ?? [], fresh.challenges, ['solved']),
    milestones: mergeById(stored.milestones ?? [], fresh.milestones, ['done']),
    applications: stored.applications ?? [],
    logs: stored.logs ?? {},
  };
}
