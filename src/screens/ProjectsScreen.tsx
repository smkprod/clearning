import { useState } from 'react';
import styles from './ProjectsScreen.module.css';
import { useAppState } from '../state/AppStateContext';
import { ProgressBar } from '../components/ProgressBar';
import { TRACK_COLORS } from '../components/TrackBadge';
import type { Project } from '../types';
import { TRACK_LABELS } from '../types';

const stepsDone = (p: Project) => p.steps.filter((s) => s.done).length;
const isComplete = (p: Project) => p.steps.length > 0 && stepsDone(p) === p.steps.length;

export function ProjectsScreen() {
  const { state, actions } = useAppState();
  const projects = state.projects;

  // текущий проект = первый недоделанный
  const currentId = projects.find((p) => !isComplete(p))?.id ?? null;
  const [open, setOpen] = useState<string | null>(currentId);

  const totalSteps = projects.reduce((n, p) => n + p.steps.length, 0);
  const doneSteps = projects.reduce((n, p) => n + stepsDone(p), 0);
  const overallPct = totalSteps ? Math.round((doneSteps / totalSteps) * 100) : 0;

  return (
    <div>
      <p className={styles.intro}>
        Проекты — это <strong>позвоночник</strong> обучения. Ежедневные задачи из очереди дают
        навыки; здесь ты собираешь их в живое приложение и в портфолио. Строй по порядку, сверху
        вниз: каждый проект опирается на предыдущий и даёт артефакт для CV. Один проект — это
        неделя-две параллельно с ежедневными задачами, не вместо них.
      </p>

      <div className={styles.overall}>
        <span className={styles.overallPct}>{overallPct}%</span>
        <div style={{ flex: 1, maxWidth: 320 }}>
          <ProgressBar value={overallPct} color="var(--track-backend)" label="Прогресс по проектам" />
        </div>
        <span className={styles.stepCount}>
          {doneSteps}/{totalSteps} шагов · {projects.filter(isComplete).length}/{projects.length} проектов
        </span>
      </div>

      {projects.map((p, i) => {
        const done = isComplete(p);
        const opened = open === p.id;
        const stepPct = p.steps.length ? (stepsDone(p) / p.steps.length) * 100 : 0;
        return (
          <section key={p.id} className={`card ${styles.project}`}>
            <div
              className={styles.projectHeader}
              role="button"
              tabIndex={0}
              aria-expanded={opened}
              onClick={() => setOpen(opened ? null : p.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setOpen(opened ? null : p.id);
                }
              }}
            >
              <span className={`${styles.chevron} ${opened ? styles.chevronOpen : ''}`}>▶</span>
              <div className={styles.projectBody}>
                <div className={styles.projectTitleRow}>
                  <span className={`${styles.projectNum} ${done ? styles.projectNumDone : ''}`}>
                    {done ? '✓' : i + 1}
                  </span>
                  <span className={styles.projectTitle}>{p.title}</span>
                  {p.id === currentId && <span className={styles.currentTag}>сейчас</span>}
                </div>
                <div className={styles.projectGoal}>{p.goal}</div>
                <div className={styles.projectMeta}>
                  {p.skills.map((sk) => (
                    <span key={sk} className="track-badge" style={{ color: TRACK_COLORS[sk] }}>
                      <span className="track-dot" style={{ background: TRACK_COLORS[sk] }} />
                      {TRACK_LABELS[sk]}
                    </span>
                  ))}
                  <span className={styles.weeks}>~{p.estWeeks} нед.</span>
                </div>
                <div className={styles.miniProgress}>
                  <div className={styles.miniProgressBar}>
                    <ProgressBar value={stepPct} color="var(--track-backend)" label={`Прогресс: ${p.title}`} />
                  </div>
                  <span className={styles.stepCount}>
                    {stepsDone(p)}/{p.steps.length}
                  </span>
                </div>
              </div>
            </div>

            {opened && (
              <>
                <div className={styles.steps}>
                  {p.steps.map((st) => (
                    <label key={st.id} className={`${styles.step} ${st.done ? styles.stepDone : ''}`}>
                      <input
                        type="checkbox"
                        checked={st.done}
                        onChange={() => actions.toggleProjectStep(p.id, st.id)}
                      />
                      <span className={styles.stepLabel}>{st.label}</span>
                    </label>
                  ))}
                </div>
                <div className={styles.urls}>
                  <div className={styles.urlRow}>
                    <span className={styles.urlLabel}>GitHub</span>
                    <input
                      className="input mono"
                      style={{ fontSize: 12.5 }}
                      placeholder="https://github.com/…"
                      value={p.repoUrl}
                      aria-label={`Ссылка на репозиторий: ${p.title}`}
                      onChange={(e) => actions.setProjectUrl(p.id, 'repoUrl', e.target.value)}
                    />
                    {p.repoUrl && (
                      <a href={p.repoUrl} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">
                        ↗
                      </a>
                    )}
                  </div>
                  <div className={styles.urlRow}>
                    <span className={styles.urlLabel}>Live URL</span>
                    <input
                      className="input mono"
                      style={{ fontSize: 12.5 }}
                      placeholder="https://…azurewebsites.net"
                      value={p.liveUrl}
                      aria-label={`Живой URL: ${p.title}`}
                      onChange={(e) => actions.setProjectUrl(p.id, 'liveUrl', e.target.value)}
                    />
                    {p.liveUrl && (
                      <a href={p.liveUrl} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">
                        ↗
                      </a>
                    )}
                  </div>
                </div>
              </>
            )}
          </section>
        );
      })}
    </div>
  );
}
