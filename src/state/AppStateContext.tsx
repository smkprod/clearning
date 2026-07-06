import { createContext, useCallback, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import type {
  Application,
  ApplicationStatus,
  AppState,
  CardRating,
  Flashcard,
  Track,
} from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { createInitialState, hydrateState } from './initialState';
import { rateCard as leitnerRate } from '../utils/leitner';
import { todayStr } from '../utils/date';

const STORAGE_KEY = 'clearning:state:v1';

export interface AppActions {
  logMinutes(minutes: number): void;
  startTimer(): void;
  /** останавливает таймер и записывает прошедшие минуты в сегодняшний лог */
  stopTimer(): void;
  completeTask(taskId: string, minutes: number): void;
  reopenTask(taskId: string): void;
  deferTask(taskId: string): void;
  moveTask(taskId: string, direction: -1 | 1): void;
  solveChallenge(challengeId: string, minutes: number): void;
  rateFlashcard(cardId: string, rating: CardRating): void;
  addFlashcard(track: Track, front: string, back: string): void;
  deleteFlashcard(cardId: string): void;
  toggleMilestone(milestoneId: string): void;
  toggleProjectStep(projectId: string, stepId: string): void;
  setProjectUrl(projectId: string, field: 'repoUrl' | 'liveUrl', value: string): void;
  addApplication(company: string, role: string): void;
  setApplicationStatus(appId: string, status: ApplicationStatus): void;
  deleteApplication(appId: string): void;
  updateSettings(patch: Pick<AppState, 'examDate' | 'dailyGoalMin' | 'minDayMin'>): void;
  importState(state: AppState): void;
  resetState(): void;
}

interface ContextValue {
  state: AppState;
  actions: AppActions;
}

const AppStateContext = createContext<ContextValue | null>(null);

function withLoggedWork(state: AppState, minutes: number, completedId?: string): AppState {
  const today = todayStr();
  const log = state.logs[today] ?? { minutes: 0, completedTaskIds: [] };
  return {
    ...state,
    logs: {
      ...state.logs,
      [today]: {
        minutes: log.minutes + Math.max(0, minutes),
        completedTaskIds:
          completedId && !log.completedTaskIds.includes(completedId)
            ? [...log.completedTaskIds, completedId]
            : log.completedTaskIds,
      },
    },
  };
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useLocalStorage<AppState>(STORAGE_KEY, createInitialState, hydrateState);

  const update = useCallback(
    (fn: (prev: AppState) => AppState) => setState((prev) => fn(prev)),
    [setState],
  );

  const actions = useMemo<AppActions>(
    () => ({
      logMinutes(minutes) {
        update((s) => withLoggedWork(s, minutes));
      },

      startTimer() {
        update((s) => ({ ...s, timerStartedAt: new Date().toISOString() }));
      },

      stopTimer() {
        update((s) => {
          if (!s.timerStartedAt) return s;
          const minutes = Math.round((Date.now() - Date.parse(s.timerStartedAt)) / 60_000);
          const next = minutes > 0 ? withLoggedWork(s, minutes) : s;
          return { ...next, timerStartedAt: null };
        });
      },

      completeTask(taskId, minutes) {
        update((s) => {
          const next = withLoggedWork(s, minutes, taskId);
          return {
            ...next,
            tasks: next.tasks.map((t) =>
              t.id === taskId ? { ...t, done: true, doneDate: todayStr() } : t,
            ),
          };
        });
      },

      reopenTask(taskId) {
        update((s) => {
          const task = s.tasks.find((t) => t.id === taskId);
          const logs = { ...s.logs };
          if (task?.doneDate && logs[task.doneDate]) {
            logs[task.doneDate] = {
              ...logs[task.doneDate],
              completedTaskIds: logs[task.doneDate].completedTaskIds.filter((id) => id !== taskId),
            };
          }
          return {
            ...s,
            logs,
            tasks: s.tasks.map((t) => (t.id === taskId ? { ...t, done: false, doneDate: null } : t)),
          };
        });
      },

      // «Отложить»: задача уезжает за следующие 3 невыполненные — вернётся скоро,
      // но не сегодня. Очередь не привязана к датам, ничего не «сгорает».
      deferTask(taskId) {
        update((s) => {
          const tasks = [...s.tasks];
          const from = tasks.findIndex((t) => t.id === taskId);
          if (from === -1) return s;
          const [task] = tasks.splice(from, 1);
          let pendingSeen = 0;
          let insertAt = tasks.length;
          for (let i = from; i < tasks.length; i++) {
            if (!tasks[i].done) {
              pendingSeen += 1;
              if (pendingSeen === 3) {
                insertAt = i + 1;
                break;
              }
            }
          }
          tasks.splice(insertAt, 0, task);
          return { ...s, tasks };
        });
      },

      moveTask(taskId, direction) {
        update((s) => {
          const tasks = [...s.tasks];
          const i = tasks.findIndex((t) => t.id === taskId);
          const j = i + direction;
          if (i === -1 || j < 0 || j >= tasks.length) return s;
          [tasks[i], tasks[j]] = [tasks[j], tasks[i]];
          return { ...s, tasks };
        });
      },

      solveChallenge(challengeId, minutes) {
        update((s) => {
          const next = withLoggedWork(s, minutes, challengeId);
          return {
            ...next,
            challenges: next.challenges.map((c) =>
              c.id === challengeId ? { ...c, solved: true } : c,
            ),
          };
        });
      },

      rateFlashcard(cardId, rating) {
        update((s) => ({
          ...s,
          flashcards: s.flashcards.map((f) =>
            f.id === cardId ? leitnerRate(f, rating, todayStr()) : f,
          ),
        }));
      },

      addFlashcard(track, front, back) {
        const card: Flashcard = {
          id: `fc-user-${Date.now()}`,
          track,
          front: front.trim(),
          back: back.trim(),
          box: 1,
          nextReview: todayStr(),
        };
        update((s) => ({ ...s, flashcards: [...s.flashcards, card] }));
      },

      deleteFlashcard(cardId) {
        update((s) => ({ ...s, flashcards: s.flashcards.filter((f) => f.id !== cardId) }));
      },

      toggleMilestone(milestoneId) {
        update((s) => ({
          ...s,
          milestones: s.milestones.map((m) =>
            m.id === milestoneId ? { ...m, done: !m.done } : m,
          ),
        }));
      },

      toggleProjectStep(projectId, stepId) {
        update((s) => ({
          ...s,
          projects: s.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  steps: p.steps.map((st) =>
                    st.id === stepId ? { ...st, done: !st.done } : st,
                  ),
                }
              : p,
          ),
        }));
      },

      setProjectUrl(projectId, field, value) {
        update((s) => ({
          ...s,
          projects: s.projects.map((p) =>
            p.id === projectId ? { ...p, [field]: value } : p,
          ),
        }));
      },

      addApplication(company, role) {
        const app: Application = {
          id: `app-${Date.now()}`,
          company: company.trim(),
          role: role.trim(),
          date: todayStr(),
          status: 'applied',
        };
        update((s) => ({ ...s, applications: [app, ...s.applications] }));
      },

      setApplicationStatus(appId, status) {
        update((s) => ({
          ...s,
          applications: s.applications.map((a) => (a.id === appId ? { ...a, status } : a)),
        }));
      },

      deleteApplication(appId) {
        update((s) => ({ ...s, applications: s.applications.filter((a) => a.id !== appId) }));
      },

      updateSettings(patch) {
        update((s) => ({ ...s, ...patch }));
      },

      importState(imported) {
        setState(hydrateState(imported));
      },

      resetState() {
        setState(createInitialState());
      },
    }),
    [update, setState],
  );

  const value = useMemo(() => ({ state, actions }), [state, actions]);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): ContextValue {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState требует <AppStateProvider> выше по дереву');
  return ctx;
}
