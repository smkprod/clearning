import { useEffect, useReducer } from 'react';
import styles from './WorkTimer.module.css';
import { useAppState } from '../state/AppStateContext';

function formatElapsed(ms: number): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

/**
 * Таймер занятия: включил — работаешь, выключил — минуты записались в
 * сегодняшний лог. Старт переживает перезагрузку (хранится в состоянии).
 */
export function WorkTimer() {
  const { state, actions } = useAppState();
  const startedAt = state.timerStartedAt ?? null;
  const [, tick] = useReducer((n: number) => n + 1, 0);

  useEffect(() => {
    if (!startedAt) return;
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [startedAt]);

  if (!startedAt) {
    return (
      <button type="button" className="btn btn-sm" onClick={actions.startTimer} title="Включи, когда садишься заниматься">
        ▶ Таймер
      </button>
    );
  }

  const elapsedMs = Date.now() - Date.parse(startedAt);
  const minutes = Math.round(elapsedMs / 60_000);

  return (
    <span className={styles.timer}>
      <span className={styles.pulse} aria-hidden="true" />
      <span className={styles.elapsed} aria-label="Идёт занятие">
        {formatElapsed(elapsedMs)}
      </span>
      <button type="button" className="btn btn-sm" onClick={actions.stopTimer}>
        ■ Стоп {minutes > 0 ? `(+${minutes} мин)` : ''}
      </button>
    </span>
  );
}
