import type { TaskLink } from '../types';

/** Ссылки на теорию/справку к задаче — открываются в новой вкладке. */
export function TaskLinks({ links }: { links?: TaskLink[] }) {
  if (!links || links.length === 0) return null;
  return (
    <div className="task-links">
      {links.map((link) => (
        <a key={link.url} href={link.url} target="_blank" rel="noreferrer">
          {link.label} ↗
        </a>
      ))}
    </div>
  );
}
