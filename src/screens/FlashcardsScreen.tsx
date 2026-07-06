import { useMemo, useState } from 'react';
import styles from './FlashcardsScreen.module.css';
import { useAppState } from '../state/AppStateContext';
import { TrackBadge } from '../components/TrackBadge';
import type { CardRating, Track } from '../types';
import { TRACK_LABELS } from '../types';
import { isDue, MAX_BOX } from '../utils/leitner';
import { todayStr } from '../utils/date';

const RATINGS: { rating: CardRating; label: string; hint: string; cls: string }[] = [
  { rating: 'again', label: 'Снова', hint: 'бокс 1, сейчас', cls: styles.rateAgain },
  { rating: 'hard', label: 'Трудно', hint: 'скоро', cls: styles.rateHard },
  { rating: 'good', label: 'Хорошо', hint: 'бокс +1', cls: styles.rateGood },
  { rating: 'easy', label: 'Легко', hint: 'бокс +2', cls: styles.rateEasy },
];

export function FlashcardsScreen() {
  const { state, actions } = useAppState();
  const today = todayStr();

  // очередь сессии: id карточек к повторению; «снова» возвращает в конец
  const [queue, setQueue] = useState<string[] | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);

  const [showAdd, setShowAdd] = useState(false);
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [track, setTrack] = useState<Track>('csharp');
  const [showList, setShowList] = useState(false);

  const dueCards = useMemo(
    () => state.flashcards.filter((c) => isDue(c, today)),
    [state.flashcards, today],
  );

  const activeQueue = queue ?? dueCards.map((c) => c.id);
  const currentCard = state.flashcards.find((c) => c.id === activeQueue[0]);
  const sessionActive = queue !== null && currentCard;

  const boxCounts = useMemo(() => {
    const counts = Array.from({ length: MAX_BOX }, () => 0);
    for (const c of state.flashcards) counts[Math.min(MAX_BOX, Math.max(1, c.box)) - 1] += 1;
    return counts;
  }, [state.flashcards]);

  const startSession = () => {
    setQueue(dueCards.map((c) => c.id));
    setRevealed(false);
    setReviewedCount(0);
  };

  const rate = (rating: CardRating) => {
    if (!currentCard || !queue) return;
    actions.rateFlashcard(currentCard.id, rating);
    setQueue((q) => {
      if (!q) return q;
      const rest = q.slice(1);
      // «снова» — карточка вернётся в конец текущей сессии
      return rating === 'again' ? [...rest, currentCard.id] : rest;
    });
    if (rating !== 'again') setReviewedCount((n) => n + 1);
    setRevealed(false);
  };

  const addCard = () => {
    if (!front.trim() || !back.trim()) return;
    actions.addFlashcard(track, front, back);
    setFront('');
    setBack('');
  };

  return (
    <div>
      <div className={styles.boxes} aria-label="Распределение карточек по Leitner-боксам">
        {boxCounts.map((count, i) => (
          <div key={i} className={styles.box}>
            <div className={styles.boxNum}>бокс {i + 1}</div>
            <div className={styles.boxCount}>{count}</div>
          </div>
        ))}
      </div>

      {sessionActive ? (
        <div className={`card ${styles.reviewCard}`}>
          <div className={styles.sessionMeta}>
            осталось: {activeQueue.length} · повторено: {reviewedCount} · бокс {currentCard.box}
          </div>
          <TrackBadge track={currentCard.track} />
          <div className={styles.question}>{currentCard.front}</div>

          {!revealed ? (
            <button type="button" className="btn btn-primary" onClick={() => setRevealed(true)}>
              Показать ответ
            </button>
          ) : (
            <>
              <div className={styles.answer}>{currentCard.back}</div>
              <div className={styles.rateRow}>
                {RATINGS.map(({ rating, label, hint, cls }) => (
                  <button
                    key={rating}
                    type="button"
                    className={`${styles.rateBtn} ${cls}`}
                    onClick={() => rate(rating)}
                  >
                    {label}
                    <small>{hint}</small>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className={`card ${styles.reviewCard}`}>
          {queue !== null ? (
            <>
              <div className={styles.question}>Сессия закончена ✓</div>
              <p className="dim" style={{ marginBottom: 16 }}>
                Повторено карточек: {reviewedCount}. Следующие всплывут по расписанию Leitner.
              </p>
              <button type="button" className="btn" onClick={() => setQueue(null)}>
                Ок
              </button>
            </>
          ) : dueCards.length > 0 ? (
            <>
              <div className={styles.question}>К повторению: {dueCards.length}</div>
              <p className="dim" style={{ marginBottom: 16 }}>
                Вопрос → вспомни ответ вслух → открой и оцени себя честно.
              </p>
              <button type="button" className="btn btn-primary" onClick={startSession}>
                Начать повторение
              </button>
            </>
          ) : (
            <>
              <div className={styles.question}>На сегодня всё ✓</div>
              <p className="dim">Карточки всплывут, когда придёт срок их повторения.</p>
            </>
          )}
        </div>
      )}

      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <button type="button" className="btn btn-sm" onClick={() => setShowAdd((v) => !v)}>
            {showAdd ? 'Скрыть форму' : '+ Своя карточка'}
          </button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowList((v) => !v)}>
            {showList ? 'Скрыть список' : `Все карточки (${state.flashcards.length})`}
          </button>
        </div>

        {showAdd && (
          <div className={`card ${styles.addForm}`}>
            <select
              className="input"
              value={track}
              aria-label="Трек карточки"
              onChange={(e) => setTrack(e.target.value as Track)}
            >
              {(Object.keys(TRACK_LABELS) as Track[]).map((tr) => (
                <option key={tr} value={tr}>
                  {TRACK_LABELS[tr]}
                </option>
              ))}
            </select>
            <textarea
              className="input"
              rows={2}
              placeholder="Вопрос (например, с собеса или из WISO)"
              value={front}
              onChange={(e) => setFront(e.target.value)}
            />
            <textarea
              className="input"
              rows={3}
              placeholder="Ответ своими словами"
              value={back}
              onChange={(e) => setBack(e.target.value)}
            />
            <button
              type="button"
              className="btn btn-primary"
              onClick={addCard}
              disabled={!front.trim() || !back.trim()}
            >
              Добавить карточку
            </button>
          </div>
        )}

        {showList && (
          <div className="card" style={{ padding: 0 }}>
            {state.flashcards.map((c) => (
              <div key={c.id} className={styles.listRow}>
                <div className={styles.listFront}>
                  {c.front}
                  <span className="dim" style={{ fontSize: 11, marginLeft: 8 }}>
                    {TRACK_LABELS[c.track]}
                  </span>
                </div>
                <span className={styles.listBox}>
                  бокс {c.box} · {c.nextReview}
                </span>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  aria-label={`Удалить карточку: ${c.front}`}
                  onClick={() => actions.deleteFlashcard(c.id)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
