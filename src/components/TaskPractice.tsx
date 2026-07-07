import { useState } from 'react';
import styles from './TaskPractice.module.css';
import type { Sandbox, Task } from '../types';

const SANDBOX: Record<Sandbox, { label: string; url: string }> = {
  dotnetfiddle: { label: 'Песочница C# (запусти в браузере)', url: 'https://dotnetfiddle.net/' },
  sqlbolt: { label: 'SQL-песочница', url: 'https://sqlbolt.com/' },
  leetcode: { label: 'Открыть на LeetCode', url: 'https://leetcode.com/' },
};

/**
 * «Делай здесь»: критерий готовности, кнопка песочницы (браузерный редактор,
 * без установки) и раскрываемый стартовый каркас кода с копированием.
 */
export function TaskPractice({ task }: { task: Task }) {
  const [copied, setCopied] = useState(false);
  if (!task.doneWhen && !task.starter && !task.sandbox) return null;

  const sandbox = task.sandbox ? SANDBOX[task.sandbox] : null;

  const copy = async () => {
    if (!task.starter) return;
    try {
      await navigator.clipboard.writeText(task.starter);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className={styles.wrap}>
      {task.doneWhen && (
        <div className={styles.doneWhen}>
          <b>Готово когда</b>&nbsp; {task.doneWhen}
        </div>
      )}

      {(sandbox || task.starter) && (
        <div className={styles.actions}>
          {sandbox && (
            <a
              href={sandbox.url}
              target="_blank"
              rel="noreferrer"
              className={`btn btn-sm ${styles.sandboxBtn}`}
            >
              ▶ {sandbox.label}
            </a>
          )}
        </div>
      )}

      {task.starter && (
        <details className={styles.starter}>
          <summary className={styles.summary}>
            <span>{'</>'} Показать каркас кода — вставь в песочницу и допиши</span>
            <span>▾</span>
          </summary>
          <div className={styles.codeWrap}>
            <button type="button" className={`btn btn-sm ${styles.copyBtn}`} onClick={copy}>
              {copied ? '✓ Скопировано' : 'Копировать'}
            </button>
            <pre className={styles.code}>{task.starter}</pre>
          </div>
        </details>
      )}
    </div>
  );
}
