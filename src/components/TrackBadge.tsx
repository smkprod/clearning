import type { Track } from '../types';
import { TRACK_LABELS } from '../types';

export const TRACK_COLORS: Record<Track, string> = {
  algo: 'var(--track-algo)',
  csharp: 'var(--track-csharp)',
  backend: 'var(--track-backend)',
  sql: 'var(--track-sql)',
  tests: 'var(--track-tests)',
  devops: 'var(--track-devops)',
  exam: 'var(--track-exam)',
  job: 'var(--track-job)',
};

export function TrackBadge({ track }: { track: Track }) {
  return (
    <span className="track-badge" style={{ color: TRACK_COLORS[track] }}>
      <span className="track-dot" style={{ background: TRACK_COLORS[track] }} />
      {TRACK_LABELS[track]}
    </span>
  );
}
