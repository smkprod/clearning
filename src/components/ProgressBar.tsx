interface Props {
  value: number; // 0..100
  color?: string;
  label?: string;
}

export function ProgressBar({ value, color, label }: Props) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      className="progress"
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div
        className="progress-fill"
        style={{ width: `${clamped}%`, ...(color ? { background: color } : {}) }}
      />
    </div>
  );
}
