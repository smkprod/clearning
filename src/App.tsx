import { useState } from 'react';
import styles from './App.module.css';
import { AppStateProvider, useAppState } from './state/AppStateContext';
import { Dashboard } from './screens/Dashboard';
import { QueueScreen } from './screens/QueueScreen';
import { FlashcardsScreen } from './screens/FlashcardsScreen';
import { ActivityScreen } from './screens/ActivityScreen';
import { ProjectsScreen } from './screens/ProjectsScreen';
import { JobScreen } from './screens/JobScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { WorkTimer } from './components/WorkTimer';
import { isDue } from './utils/leitner';
import { todayStr } from './utils/date';

type Screen = 'dashboard' | 'queue' | 'projects' | 'cards' | 'activity' | 'job' | 'settings';

const SCREENS: { id: Screen; label: string }[] = [
  { id: 'dashboard', label: 'Дашборд' },
  { id: 'queue', label: 'Очередь' },
  { id: 'projects', label: 'Проекты' },
  { id: 'cards', label: 'Карточки' },
  { id: 'activity', label: 'Активность' },
  { id: 'job', label: 'Работа' },
  { id: 'settings', label: 'Настройки' },
];

function Shell() {
  const [screen, setScreen] = useState<Screen>('dashboard');
  const { state } = useAppState();
  const dueCount = state.flashcards.filter((f) => isDue(f, todayStr())).length;

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.logoRow}>
          <div className={styles.logo}>
            c<span className={styles.logoAccent}>learning</span>
            <span className="dim" style={{ fontWeight: 400, fontSize: 12, marginLeft: 8 }}>
              AP2 → Junior .NET
            </span>
          </div>
          <WorkTimer />
        </div>
        <nav className={styles.nav} aria-label="Основная навигация">
          {SCREENS.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`${styles.navBtn} ${screen === s.id ? styles.navActive : ''}`}
              aria-current={screen === s.id ? 'page' : undefined}
              onClick={() => setScreen(s.id)}
            >
              {s.label}
              {s.id === 'cards' && dueCount > 0 && <span className={styles.badge}>{dueCount}</span>}
            </button>
          ))}
        </nav>
      </header>

      {screen === 'dashboard' && (
        <Dashboard
          onNavigateCards={() => setScreen('cards')}
          onNavigateProjects={() => setScreen('projects')}
        />
      )}
      {screen === 'queue' && <QueueScreen />}
      {screen === 'projects' && <ProjectsScreen />}
      {screen === 'cards' && <FlashcardsScreen />}
      {screen === 'activity' && <ActivityScreen />}
      {screen === 'job' && <JobScreen />}
      {screen === 'settings' && <SettingsScreen />}
    </div>
  );
}

export default function App() {
  return (
    <AppStateProvider>
      <Shell />
    </AppStateProvider>
  );
}
