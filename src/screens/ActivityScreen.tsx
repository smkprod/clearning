import { useMemo, useState } from 'react';
import styles from './ActivityScreen.module.css';
import { useAppState } from '../state/AppStateContext';
import { addDays, diffDays, formatDate, formatMinutes, parseDateStr, todayStr } from '../utils/date';

function level(minutes: number): string {
  if (minutes <= 0) return '';
  if (minutes < 30) return styles.l1;
  if (minutes < 60) return styles.l2;
  if (minutes < 120) return styles.l3;
  return styles.l4;
}

const MONTHS = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

const mondayOf = (dateStr: string) => {
  const dow = (parseDateStr(dateStr).getDay() + 6) % 7; // 0 = понедельник
  return addDays(dateStr, -dow);
};

export function ActivityScreen() {
  const { state } = useAppState();
  const today = todayStr();
  const [selected, setSelected] = useState<string | null>(null);

  // сетка: от старта программы до горизонта — экзамен или полгода вперёд,
  // что позже. Будущие дни видны: это оставшаяся дистанция, а не прошлое.
  const weeks = useMemo(() => {
    const start = mondayOf(state.createdAt <= today ? state.createdAt : today);
    const horizon = [state.examDate, addDays(state.createdAt, 180), today]
      .reduce((a, b) => (a >= b ? a : b));
    const weekCount = Math.floor(diffDays(start, mondayOf(horizon)) / 7) + 1;
    return Array.from({ length: weekCount }, (_, w) =>
      Array.from({ length: 7 }, (_, d) => addDays(start, w * 7 + d)),
    );
  }, [state.createdAt, state.examDate, today]);

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
        <div className="card-title">
          Дистанция: {formatDate(state.createdAt)} → экзамен {formatDate(state.examDate)} и дальше
        </div>
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
                  const isExam = date === state.examDate;
                  const label = isExam
                    ? `${formatDate(date)} — ЭКЗАМЕН AP2`
                    : future
                      ? formatDate(date)
                      : `${formatDate(date)}: ${formatMinutes(minutes)}`;
                  return (
                    <button
                      key={date}
                      type="button"
                      className={[
                        styles.cell,
                        level(minutes),
                        selected === date ? styles.cellSelected : '',
                        future ? styles.cellFuture : '',
                        date === today ? styles.cellToday : '',
                        isExam ? styles.cellExam : '',
                      ].join(' ')}
                      title={label}
                      aria-label={label}
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
          <span style={{ marginLeft: 16 }}>сегодня</span>
          <span className={`${styles.legendCell} ${styles.cellToday}`} />
          <span style={{ marginLeft: 16 }}>экзамен</span>
          <span className={`${styles.legendCell} ${styles.cellExam}`} />
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
