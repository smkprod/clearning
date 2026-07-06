import { useMemo, useState } from 'react';
import styles from './Dashboard.module.css';
import { useAppState } from '../state/AppStateContext';
import { TrackBadge } from '../components/TrackBadge';
import { ProgressBar } from '../components/ProgressBar';
import { MinutesModal } from '../components/MinutesModal';
import { TaskLinks } from '../components/TaskLinks';
import { challengeStreak, examPace, jobReadinessPercent, studyStreak, totalMinutes, weekMinutes } from '../utils/stats';
import { formatDate, formatMinutes, todayStr } from '../utils/date';
import { isDue } from '../utils/leitner';
import { TASK_TYPE_LABELS } from '../types';

interface Props {
  onNavigateCards(): void;
  onNavigateProjects(): void;
}

type PendingDone = { kind: 'task' | 'challenge'; id: string; title: string; estMin?: number };

export function Dashboard({ onNavigateCards, onNavigateProjects }: Props) {
  const { state, actions } = useAppState();
  const today = todayStr();
  const [pendingDone, setPendingDone] = useState<PendingDone | null>(null);
  const [manualMin, setManualMin] = useState('');

  const pace = useMemo(() => examPace(state, today), [state, today]);
  const streak = studyStreak(state.logs, state.minDayMin, today);
  const chStreak = challengeStreak(state.logs, today);
  const total = totalMinutes(state.logs);
  const week = weekMinutes(state.logs, today);
  const readiness = jobReadinessPercent(state);

  const todayTasks = useMemo(() => state.tasks.filter((t) => !t.done).slice(0, 2), [state.tasks]);
  const challenge = useMemo(() => state.challenges.find((c) => !c.solved), [state.challenges]);
  const dueCards = state.flashcards.filter((f) => isDue(f, today));
  const currentProject = useMemo(
    () => state.projects.find((p) => p.steps.some((s) => !s.done)),
    [state.projects],
  );
  const nextStep = currentProject?.steps.find((s) => !s.done);
  const todayMinutes = state.logs[today]?.minutes ?? 0;
  const dayPct = (todayMinutes / state.dailyGoalMin) * 100;
  const minMarkPct = Math.min(100, (state.minDayMin / state.dailyGoalMin) * 100);

  const submitDone = (minutes: number) => {
    if (!pendingDone) return;
    if (pendingDone.kind === 'task') actions.completeTask(pendingDone.id, minutes);
    else actions.solveChallenge(pendingDone.id, minutes);
    setPendingDone(null);
  };

  const addManual = () => {
    const m = Number(manualMin);
    if (m > 0) {
      actions.logMinutes(m);
      setManualMin('');
    }
  };

  return (
    <div>
      {/* обратный отсчёт + темп */}
      <section className={styles.countdownCard} aria-label="Обратный отсчёт до экзамена">
        <div>
          <div className="card-title">До AP2 · {formatDate(state.examDate)}</div>
          <div className={styles.countdownDays}>
            {pace.daysLeft} <span style={{ fontSize: 18 }}>дн.</span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className={pace.onTrack ? styles.paceOk : styles.paceBehind}>
            {pace.onTrack ? '✓ В графике' : `⚠ Отстаёшь на ${pace.behindBy} задач(и)`}
          </div>
          <div className="dim" style={{ fontSize: 13, marginTop: 4 }}>
            Трек «Экзамен»: {pace.done}/{pace.total} задач (план к сегодня — {pace.expected})
          </div>
          <div style={{ marginTop: 8, width: 220, maxWidth: '100%' }}>
            <ProgressBar
              value={(pace.done / Math.max(1, pace.total)) * 100}
              color="var(--track-exam)"
              label="Прогресс подготовки к экзамену"
            />
          </div>
        </div>
      </section>

      {/* статистика */}
      <div className={styles.grid}>
        <div className={styles.stat}>
          <div className={styles.statValue}>{streak}🔥</div>
          <div className={styles.statLabel}>Стрик (дней ≥ {state.minDayMin} мин)</div>
          <div className={styles.statSub}>челлендж-стрик: {chStreak}</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statValue}>{Math.round(total / 60)}</div>
          <div className={styles.statLabel}>Часов всего</div>
          <div className={styles.statSub}>{formatMinutes(total)}</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statValue}>{(week / 60).toFixed(1)}</div>
          <div className={styles.statLabel}>Часов за 7 дней</div>
          <div className={styles.statSub}>цель: {((state.dailyGoalMin * 7) / 60).toFixed(0)} ч/нед</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statValue}>{readiness}%</div>
          <div className={styles.statLabel}>Готовность к работе</div>
          <div className={styles.statSub}>
            {state.milestones.filter((m) => m.done).length}/{state.milestones.length} майлстоунов
          </div>
        </div>
      </div>

      {/* Сегодня */}
      <section className={`card ${styles.today}`} aria-label="План на сегодня">
        <div className={styles.todayHeader}>
          <h2 style={{ fontSize: 16 }}>Сегодня</h2>
          <div className={styles.dayProgress}>
            <span className="mono dim" style={{ fontSize: 12 }}>
              {todayMinutes}/{state.dailyGoalMin} мин
            </span>
            <div className={styles.dayProgressBar}>
              <ProgressBar value={dayPct} label="Прогресс дня" />
              <div
                className={styles.minMark}
                style={{ left: `${minMarkPct}%` }}
                title={`Минимальный день: ${state.minDayMin} мин — стрик сохранён`}
              />
            </div>
          </div>
        </div>

        {todayTasks.length === 0 && (
          <div className={styles.allDone}>Очередь пуста — вся программа пройдена. 🎉</div>
        )}

        {todayTasks.map((task) => (
          <div key={task.id} className={styles.item}>
            <div className={styles.itemBody}>
              <TrackBadge track={task.track} />
              <div className={styles.itemTitle}>{task.title}</div>
              <div className={styles.itemDetail}>{task.detail}</div>
              <TaskLinks links={task.links} />
              <div className={styles.itemMeta}>
                ~{task.estMin} мин · {TASK_TYPE_LABELS[task.type]}
              </div>
            </div>
            <div className={styles.itemActions}>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() =>
                  setPendingDone({ kind: 'task', id: task.id, title: task.title, estMin: task.estMin })
                }
              >
                Готово
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => actions.deferTask(task.id)}
              >
                Отложить
              </button>
            </div>
          </div>
        ))}

        {challenge && (
          <div className={styles.item}>
            <div className={styles.itemBody}>
              <span className="track-badge" style={{ color: 'var(--accent)' }}>
                <span className="track-dot" style={{ background: 'var(--accent)' }} />
                код-челлендж дня
              </span>
              <div className={styles.itemTitle}>
                {challenge.link ? (
                  <a href={challenge.link} target="_blank" rel="noreferrer">
                    {challenge.title}
                  </a>
                ) : (
                  challenge.title
                )}
              </div>
              <div className={styles.itemDetail}>
                Реши сам, без подсказок. Потом попроси AI отревьюить решение.
              </div>
              <div className={styles.itemMeta}>{challenge.difficulty} · стрик {chStreak}🔥</div>
            </div>
            <div className={styles.itemActions}>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() =>
                  setPendingDone({ kind: 'challenge', id: challenge.id, title: challenge.title, estMin: 30 })
                }
              >
                Решил
              </button>
            </div>
          </div>
        )}

        <div className={`${styles.item} ${styles.cardsCta}`}>
          <div>
            <span className="track-badge" style={{ color: 'var(--track-csharp)' }}>
              <span className="track-dot" style={{ background: 'var(--track-csharp)' }} />
              повторение
            </span>
            <div className={styles.itemTitle}>
              {dueCards.length > 0
                ? `Карточек к повторению: ${dueCards.length}`
                : 'Все карточки повторены ✓'}
            </div>
          </div>
          {dueCards.length > 0 && (
            <button type="button" className="btn btn-sm" onClick={onNavigateCards}>
              Повторить →
            </button>
          )}
        </div>

        {currentProject && (
          <div className={`${styles.item} ${styles.cardsCta}`}>
            <div>
              <span className="track-badge" style={{ color: 'var(--track-backend)' }}>
                <span className="track-dot" style={{ background: 'var(--track-backend)' }} />
                текущий проект
              </span>
              <div className={styles.itemTitle}>{currentProject.title}</div>
              <div className={styles.itemDetail}>
                Следующий шаг: {nextStep ? nextStep.label : 'все шаги сделаны ✓'}
              </div>
            </div>
            <button type="button" className="btn btn-sm" onClick={onNavigateProjects}>
              К проекту →
            </button>
          </div>
        )}

        {/* лог времени */}
        <div className={styles.logRow}>
          <span className="dim" style={{ fontSize: 13 }}>
            Записать время:
          </span>
          {[15, 30, 45].map((m) => (
            <button key={m} type="button" className="btn btn-sm" onClick={() => actions.logMinutes(m)}>
              +{m}
            </button>
          ))}
          <input
            className="input"
            style={{ width: 80 }}
            type="number"
            min={1}
            placeholder="мин"
            value={manualMin}
            aria-label="Минуты вручную"
            onChange={(e) => setManualMin(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addManual()}
          />
          <button type="button" className="btn btn-sm" onClick={addManual} disabled={!Number(manualMin)}>
            +
          </button>
          <span className="dim" style={{ fontSize: 12 }}>
            …или включи ▶ Таймер в шапке — минуты запишутся сами
          </span>
        </div>
      </section>

      {pendingDone && (
        <MinutesModal
          title={pendingDone.kind === 'task' ? 'Задача сделана!' : 'Челлендж решён!'}
          subtitle={`${pendingDone.title} — сколько минут заняло?`}
          defaultMinutes={pendingDone.estMin}
          onSubmit={submitDone}
          onCancel={() => setPendingDone(null)}
        />
      )}
    </div>
  );
}
