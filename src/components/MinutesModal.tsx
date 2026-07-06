import { useEffect, useRef, useState } from 'react';
import styles from './MinutesModal.module.css';

interface Props {
  title: string;
  subtitle?: string;
  defaultMinutes?: number;
  onSubmit(minutes: number): void;
  onCancel(): void;
}

const QUICK = [15, 30, 45, 60];

/** Спрашивает, сколько минут заняла задача: быстрые кнопки + ручной ввод. */
export function MinutesModal({ title, subtitle, defaultMinutes, onSubmit, onCancel }: Props) {
  const [minutes, setMinutes] = useState<number>(defaultMinutes ?? 30);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dialogRef.current?.querySelector('button')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCancel]);

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.title}>{title}</div>
        {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
        <div className={styles.chips}>
          {QUICK.map((m) => (
            <button
              key={m}
              type="button"
              className={`${styles.chip} ${minutes === m ? styles.chipActive : ''}`}
              onClick={() => setMinutes(m)}
            >
              {m} мин
            </button>
          ))}
        </div>
        <div className={styles.row}>
          <input
            className="input"
            type="number"
            min={0}
            max={720}
            value={minutes}
            aria-label="Минуты вручную"
            onChange={(e) => setMinutes(Math.max(0, Number(e.target.value) || 0))}
          />
          <span className="dim">мин</span>
        </div>
        <div className={styles.actions}>
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            Отмена
          </button>
          <button type="button" className="btn btn-primary" onClick={() => onSubmit(minutes)}>
            Записать
          </button>
        </div>
      </div>
    </div>
  );
}
