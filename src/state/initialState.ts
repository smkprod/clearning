import type { AppState, Flashcard, Project, Task } from '../types';
import {
  CURRICULUM_CHALLENGES,
  CURRICULUM_FLASHCARDS,
  CURRICULUM_MILESTONES,
  CURRICULUM_PROJECTS,
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
    projects: CURRICULUM_PROJECTS.map((p) => ({ ...p, repoUrl: '', liveUrl: '' })),
    logs: {},
    timerStartedAt: null,
  };
}

/**
 * Проекты обновляются из сида по id: контент шагов свежий, но галочки
 * (step.done) и введённые пользователем ссылки (repoUrl/liveUrl) сохраняются.
 * Порядок канонический — берётся из сида.
 */
function mergeProjects(stored: Project[] | undefined, seeded: Project[]): Project[] {
  const storedById = new Map((stored ?? []).map((p) => [p.id, p]));
  return seeded.map((seed) => {
    const prev = storedById.get(seed.id);
    if (!prev) return seed;
    const prevStep = new Map(prev.steps.map((s) => [s.id, s]));
    return {
      ...seed,
      steps: seed.steps.map((s) => ({ ...s, done: prevStep.get(s.id)?.done ?? false })),
      repoUrl: prev.repoUrl ?? '',
      liveUrl: prev.liveUrl ?? '',
    };
  });
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

  // Контент берём из сида, прогресс (progressKeys) — из сохранённого.
  // Новые элементы сида вставляются после своего ближайшего «соседа сверху»
  // из сида, а не в конец — так разминка попадает в начало очереди, не ломая
  // пользовательский порядок уже существующих задач.
  const mergeById = <T extends { id: string }>(
    existing: T[],
    seeded: T[],
    progressKeys: (keyof T)[],
  ): T[] => {
    const seedById = new Map(seeded.map((s) => [s.id, s]));
    const merged = existing.map((item) => {
      const seed = seedById.get(item.id);
      if (!seed) return item; // пользовательский элемент — не трогаем
      const progress = Object.fromEntries(progressKeys.map((k) => [k, item[k]]));
      return { ...seed, ...progress };
    });
    const known = new Set(existing.map((x) => x.id));
    seeded.forEach((seed, seedIdx) => {
      if (known.has(seed.id)) return;
      let insertAt = 0;
      for (let j = seedIdx - 1; j >= 0; j--) {
        const idx = merged.findIndex((m) => m.id === seeded[j].id);
        if (idx !== -1) {
          insertAt = idx + 1;
          break;
        }
      }
      merged.splice(insertAt, 0, { ...seed });
      known.add(seed.id);
    });
    return merged;
  };

  return {
    ...fresh,
    ...stored,
    tasks: mergeById<Task>(stored.tasks ?? [], fresh.tasks, ['done', 'doneDate']),
    flashcards: mergeById<Flashcard>(stored.flashcards ?? [], fresh.flashcards, ['box', 'nextReview']),
    challenges: mergeById(stored.challenges ?? [], fresh.challenges, ['solved']),
    milestones: mergeById(stored.milestones ?? [], fresh.milestones, ['done']),
    applications: stored.applications ?? [],
    projects: mergeProjects(stored.projects, fresh.projects),
    logs: stored.logs ?? {},
  };
}
