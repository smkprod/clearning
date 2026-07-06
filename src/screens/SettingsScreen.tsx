import { useRef, useState } from 'react';
import styles from './SettingsScreen.module.css';
import { useAppState } from '../state/AppStateContext';
import type { AppState } from '../types';
import { todayStr } from '../utils/date';

export function SettingsScreen() {
  const { state, actions } = useAppState();
  const fileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [examDate, setExamDate] = useState(state.examDate);
  const [dailyGoal, setDailyGoal] = useState(String(state.dailyGoalMin));
  const [minDay, setMinDay] = useState(String(state.minDayMin));

  const saveSettings = () => {
    actions.updateSettings({
      examDate,
      dailyGoalMin: Math.max(10, Number(dailyGoal) || state.dailyGoalMin),
      minDayMin: Math.max(5, Number(minDay) || state.minDayMin),
    });
    setMessage('Настройки сохранены.');
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clearning-backup-${todayStr()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage('Бэкап скачан. Храни его вне браузера.');
  };

  const importJson = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as AppState;
        if (!Array.isArray(parsed.tasks) || typeof parsed.logs !== 'object') {
          throw new Error('это не бэкап clearning');
        }
        actions.importState(parsed);
        setMessage('Состояние импортировано.');
      } catch (err) {
        setMessage(`Не удалось импортировать: ${err instanceof Error ? err.message : 'ошибка'}`);
      }
    };
    reader.readAsText(file);
  };

  const reset = () => {
    if (window.confirm('Сбросить ВЕСЬ прогресс? Это действие необратимо (сделай сначала экспорт).')) {
      actions.resetState();
      setMessage('Прогресс сброшен, программа начата заново.');
    }
  };

  return (
    <div>
      <section className={`card ${styles.section}`}>
        <div className="card-title">Цели</div>
        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor="exam-date">
            Дата экзамена (AP2)
          </label>
          <input
            id="exam-date"
            className="input"
            type="date"
            value={examDate}
            onChange={(e) => setExamDate(e.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor="daily-goal">
            Дневная цель, минут
          </label>
          <input
            id="daily-goal"
            className="input"
            type="number"
            min={10}
            value={dailyGoal}
            onChange={(e) => setDailyGoal(e.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor="min-day">
            Минимальный день, минут (для стрика в плохие дни)
          </label>
          <input
            id="min-day"
            className="input"
            type="number"
            min={5}
            value={minDay}
            onChange={(e) => setMinDay(e.target.value)}
          />
        </div>
        <button type="button" className="btn btn-primary" onClick={saveSettings}>
          Сохранить
        </button>
      </section>

      <section className={`card ${styles.section}`}>
        <div className="card-title">Бэкап</div>
        <div className={styles.row}>
          <button type="button" className="btn" onClick={exportJson}>
            ⬇ Экспорт в JSON
          </button>
          <button type="button" className="btn" onClick={() => fileRef.current?.click()}>
            ⬆ Импорт из JSON
          </button>
          <input
            ref={fileRef}
            className={styles.hiddenInput}
            type="file"
            accept="application/json,.json"
            aria-label="Файл бэкапа"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) importJson(file);
              e.target.value = '';
            }}
          />
        </div>
        <p className={styles.hint}>
          Всё хранится в localStorage этого браузера. Экспортируй JSON регулярно — это единственный
          бэкап при смене браузера или устройства.
        </p>
      </section>

      <section className={`card ${styles.section}`}>
        <div className="card-title">Опасная зона</div>
        <button type="button" className="btn btn-danger" onClick={reset}>
          Сбросить весь прогресс
        </button>
      </section>

      {message && (
        <p className="dim" role="status">
          {message}
        </p>
      )}
    </div>
  );
}
