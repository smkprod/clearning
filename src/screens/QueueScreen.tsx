import { useMemo, useState } from 'react';
import styles from './QueueScreen.module.css';
import { useAppState } from '../state/AppStateContext';
import { MinutesModal } from '../components/MinutesModal';
import { TaskLinks } from '../components/TaskLinks';
import { ProgressBar } from '../components/ProgressBar';
import { TRACK_COLORS } from '../components/TrackBadge';
import type { Task, Track } from '../types';
import { TRACK_LABELS } from '../types';

const ALL_TRACKS = Object.keys(TRACK_LABELS) as Track[];

export function QueueScreen() {
  const { state, actions } = useAppState();
  const [filter, setFilter] = useState<Track | 'all'>('all');
  const [showDone, setShowDone] = useState(false);
  const [groupByTrack, setGroupByTrack] = useState(true);
  const [pendingTask, setPendingTask] = useState<Task | null>(null);

  // позиция в очереди = порядок в массиве; считаем до фильтрации
  const positions = useMemo(() => {
    const map = new Map<string, number>();
    let pos = 0;
    for (const t of state.tasks) {
      if (!t.done) {
        pos += 1;
        map.set(t.id, pos);
      }
    }
    return map;
  }, [state.tasks]);

  const visible = state.tasks.filter(
    (t) => (filter === 'all' || t.track === filter) && (showDone || !t.done),
  );

  const groups: { track: Track; tasks: Task[] }[] = groupByTrack
    ? ALL_TRACKS.map((track) => ({ track, tasks: visible.filter((t) => t.track === track) })).filter(
        (g) => g.tasks.length > 0,
      )
    : [];

  const renderRow = (task: Task) => (
    <div key={task.id} className={`${styles.row} ${task.done ? styles.rowDone : ''}`}>
      <span className={styles.queuePos}>{task.done ? '✓' : `#${positions.get(task.id)}`}</span>
      <div className={styles.rowBody}>
        <div className={`${styles.rowTitle} ${task.done ? styles.rowTitleDone : ''}`}>
          {task.title}
        </div>
        <div className={styles.rowDetail}>{task.detail}</div>
        {!task.done && <TaskLinks links={task.links} />}
        <div className={styles.rowMeta}>
          <span style={{ color: TRACK_COLORS[task.track] }}>{TRACK_LABELS[task.track]}</span>
          {' · '}~{task.estMin} мин
          {task.doneDate && ` · сделано ${task.doneDate}`}
        </div>
      </div>
      <div className={styles.rowActions}>
        {!task.done && (
          <>
            <button
              type="button"
              className={styles.iconBtn}
              aria-label="Выше в очереди"
              title="Выше в очереди"
              onClick={() => actions.moveTask(task.id, -1)}
            >
              ↑
            </button>
            <button
              type="button"
              className={styles.iconBtn}
              aria-label="Ниже в очереди"
              title="Ниже в очереди"
              onClick={() => actions.moveTask(task.id, 1)}
            >
              ↓
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => actions.deferTask(task.id)}
            >
              Отложить
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setPendingTask(task)}
            >
              Готово
            </button>
          </>
        )}
        {task.done && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => actions.reopenTask(task.id)}>
            Вернуть
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div>
      <div className={styles.toolbar}>
        <button
          type="button"
          className={`${styles.filterBtn} ${filter === 'all' ? styles.filterActive : ''}`}
          onClick={() => setFilter('all')}
        >
          все
        </button>
        {ALL_TRACKS.map((track) => (
          <button
            key={track}
            type="button"
            className={`${styles.filterBtn} ${filter === track ? styles.filterActive : ''}`}
            style={filter === track ? { color: TRACK_COLORS[track] } : undefined}
            onClick={() => setFilter(track)}
          >
            {TRACK_LABELS[track]}
          </button>
        ))}
        <span style={{ flex: 1 }} />
        <label className="dim" style={{ fontSize: 13, display: 'flex', gap: 6, alignItems: 'center' }}>
          <input
            type="checkbox"
            checked={groupByTrack}
            onChange={(e) => setGroupByTrack(e.target.checked)}
          />
          по трекам
        </label>
        <label className="dim" style={{ fontSize: 13, display: 'flex', gap: 6, alignItems: 'center' }}>
          <input type="checkbox" checked={showDone} onChange={(e) => setShowDone(e.target.checked)} />
          выполненные
        </label>
      </div>

      {groupByTrack
        ? groups.map(({ track, tasks }) => {
            const all = state.tasks.filter((t) => t.track === track);
            const done = all.filter((t) => t.done).length;
            return (
              <section key={track} className={styles.trackSection}>
                <div className={styles.trackHeader}>
                  <h2 style={{ fontSize: 14, color: TRACK_COLORS[track] }}>{TRACK_LABELS[track]}</h2>
                  <div className={styles.trackProgress}>
                    <ProgressBar
                      value={(done / Math.max(1, all.length)) * 100}
                      color={TRACK_COLORS[track]}
                      label={`Прогресс трека ${TRACK_LABELS[track]}`}
                    />
                  </div>
                  <span className={styles.trackCount}>
                    {done}/{all.length}
                  </span>
                </div>
                {tasks.map(renderRow)}
              </section>
            );
          })
        : visible.map(renderRow)}

      {pendingTask && (
        <MinutesModal
          title="Задача сделана!"
          subtitle={`${pendingTask.title} — сколько минут заняло?`}
          defaultMinutes={pendingTask.estMin}
          onSubmit={(min) => {
            actions.completeTask(pendingTask.id, min);
            setPendingTask(null);
          }}
          onCancel={() => setPendingTask(null)}
        />
      )}
    </div>
  );
}
