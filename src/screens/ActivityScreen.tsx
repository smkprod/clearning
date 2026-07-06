import { useMemo, useState } from 'react';
import styles from './ActivityScreen.module.css';
import { useAppState } from '../state/AppStateContext';
import { addDays, formatDate, formatMinutes, parseDateStr, todayStr } from '../utils/date';

const WEEKS = 26;

function level(minutes: number): string {
  if (minutes <= 0) return '';
  if (minutes < 30) return styles.l1;
  if (minutes < 60) return styles.l2;
  if (minutes < 120) return styles.l3;
  return styles.l4;
}

const MONTHS = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

export function ActivityScreen() {
  const { state } = useAppState();
  const today = todayStr();
  const [selected, setSelected] = useState<string | null>(null);

  // сетка: колонки — недели (пн-вс), последняя колонка — текущая неделя
  const weeks = useMemo(() => {
    const t = parseDateStr(today);
    const dow = (t.getDay() + 6) % 7; // 0 = понедельник
    const monday = addDays(today, -dow);
    const start = addDays(monday, -(WEEKS - 1) * 7);
    return Array.from({ length: WEEKS }, (_, w) =>
      Array.from({ length: 7 }, (_, d) => addDays(start, w * 7 + d)),
    );
  }, [today]);

  const monthLabels = weeks.map((week, i) => {
    const first = parseDateStr(week[0]);
    if (i === 0) return MONTHS[first.getMonth()];
    const prev = parseDateStr(weeks[i - 1][0]);
    return first.getMonth() !== prev.getMonth() ? MONTHS[first.getMonth()] : '';
  });

  const selectedLog = selected ? state.logs[selected] : undefined;

  const completedItems = (ids: string[]) =>
    ids.map((id) => {
      const task = state.tasks.find((t) => t.id === id);
      if (task) return `${task.title} (${task.estMin} мин план)`;
      const ch = state.challenges.find((c) => c.id === id);
      if (ch) return `Челлендж: ${ch.title}`;
      return id;
    });

  return (
    <div>
      <section className="card">
        <div className="card-title">Активность за {WEEKS} недель</div>
        <div className={styles.heatmapWrap}>
          <div className={styles.monthLabels}>
            {monthLabels.map((m, i) => (
              <span key={i} className={styles.monthLabel}>
                {m}
              </span>
            ))}
          </div>
          <div className={styles.heatmap}>
            {weeks.map((week, wi) => (
              <div key={wi} className={styles.weekCol}>
                {week.map((date) => {
                  const minutes = state.logs[date]?.minutes ?? 0;
                  const future = date > today;
                  return (
                    <button
                      key={date}
                      type="button"
                      className={[
                        styles.cell,
                        level(minutes),
                        selected === date ? styles.cellSelected : '',
                        future ? styles.cellFuture : '',
                      ].join(' ')}
                      title={`${formatDate(date)}: ${formatMinutes(minutes)}`}
                      aria-label={`${formatDate(date)}: ${formatMinutes(minutes)}`}
                      disabled={future}
                      onClick={() => setSelected(date === selected ? null : date)}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        <div className={styles.legend}>
          меньше
          <span className={styles.legendCell} />
          <span className={`${styles.legendCell} ${styles.l1}`} />
          <span className={`${styles.legendCell} ${styles.l2}`} />
          <span className={`${styles.legendCell} ${styles.l3}`} />
          <span className={`${styles.legendCell} ${styles.l4}`} />
          больше
        </div>
      </section>

      {selected && (
        <section className={`card ${styles.dayDetail}`}>
          <div className="card-title">{formatDate(selected)}</div>
          {selectedLog && selectedLog.minutes > 0 ? (
            <>
              <p>
                <span className="mono">{formatMinutes(selectedLog.minutes)}</span> занятий
              </p>
              {selectedLog.completedTaskIds.length > 0 ? (
                <ul className={styles.detailList}>
                  {completedItems(selectedLog.completedTaskIds).map((label, i) => (
                    <li key={i}>{label}</li>
                  ))}
                </ul>
              ) : (
                <p className="dim" style={{ marginTop: 6 }}>
                  Время записано без привязки к задачам.
                </p>
              )}
            </>
          ) : (
            <p className="dim">В этот день занятий не записано.</p>
          )}
        </section>
      )}
    </div>
  );
}
