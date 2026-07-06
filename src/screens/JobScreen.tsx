import { useState } from 'react';
import styles from './JobScreen.module.css';
import { useAppState } from '../state/AppStateContext';
import { ProgressBar } from '../components/ProgressBar';
import { jobReadinessPercent } from '../utils/stats';
import type { ApplicationStatus } from '../types';

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  applied: 'отправлено',
  interview: 'интервью',
  offer: 'оффер',
  rejected: 'отказ',
};

const STATUS_CLASS: Record<ApplicationStatus, string> = {
  applied: styles.statusApplied,
  interview: styles.statusInterview,
  offer: styles.statusOffer,
  rejected: styles.statusRejected,
};

export function JobScreen() {
  const { state, actions } = useAppState();
  const readiness = jobReadinessPercent(state);
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');

  const add = () => {
    if (!company.trim()) return;
    actions.addApplication(company, role || 'Junior .NET Developer');
    setCompany('');
    setRole('');
  };

  const byStatus = (s: ApplicationStatus) => state.applications.filter((a) => a.status === s).length;

  return (
    <div>
      <section className="card" style={{ marginBottom: 12 }}>
        <div className="card-title">Готовность к работе</div>
        <div className={styles.readinessHeader}>
          <span className={styles.percent}>{readiness}%</span>
          <div style={{ flex: 1 }}>
            <ProgressBar value={readiness} color="var(--track-job)" label="Готовность к работе" />
          </div>
        </div>
        {state.milestones.map((m) => (
          <label
            key={m.id}
            className={`${styles.milestone} ${m.done ? styles.milestoneDone : ''}`}
          >
            <input type="checkbox" checked={m.done} onChange={() => actions.toggleMilestone(m.id)} />
            <span className={styles.milestoneLabel}>{m.label}</span>
          </label>
        ))}
      </section>

      <section className="card">
        <div className="card-title">Трекер заявок · Ruhrgebiet + remote</div>

        <div className={styles.counts}>
          <span>всего: {state.applications.length}/20+</span>
          <span className={styles.statusApplied}>отправлено: {byStatus('applied')}</span>
          <span className={styles.statusInterview}>интервью: {byStatus('interview')}</span>
          <span className={styles.statusOffer}>офферы: {byStatus('offer')}</span>
          <span className={styles.statusRejected}>отказы: {byStatus('rejected')}</span>
        </div>

        <div className={styles.appForm}>
          <input
            className="input"
            placeholder="Компания"
            value={company}
            aria-label="Компания"
            onChange={(e) => setCompany(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && add()}
          />
          <input
            className="input"
            placeholder="Роль (Junior .NET Developer)"
            value={role}
            aria-label="Роль"
            onChange={(e) => setRole(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && add()}
          />
          <button type="button" className="btn btn-primary" onClick={add} disabled={!company.trim()}>
            + Заявка
          </button>
        </div>

        {state.applications.length > 0 && (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Компания</th>
                  <th>Роль</th>
                  <th>Дата</th>
                  <th>Статус</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {state.applications.map((a) => (
                  <tr key={a.id}>
                    <td>{a.company}</td>
                    <td className="dim">{a.role}</td>
                    <td className="mono dim">{a.date}</td>
                    <td>
                      <select
                        className={`${styles.statusSelect} ${STATUS_CLASS[a.status]}`}
                        value={a.status}
                        aria-label={`Статус заявки в ${a.company}`}
                        onChange={(e) =>
                          actions.setApplicationStatus(a.id, e.target.value as ApplicationStatus)
                        }
                      >
                        {(Object.keys(STATUS_LABELS) as ApplicationStatus[]).map((s) => (
                          <option key={s} value={s}>
                            {STATUS_LABELS[s]}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        aria-label={`Удалить заявку в ${a.company}`}
                        onClick={() => actions.deleteApplication(a.id)}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
