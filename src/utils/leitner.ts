import type { CardRating, Flashcard } from '../types';
import { addDays } from './date';

/** Интервал повторения (в днях) для каждого Leitner-бокса, индекс = номер бокса. */
const BOX_INTERVAL_DAYS = [0, 1, 2, 4, 8, 16];

export const MAX_BOX = 5;

/**
 * Самооценка двигает карточку по боксам:
 *  - «снова»  → бокс 1, карточка остаётся в сегодняшней сессии;
 *  - «трудно» → бокс не растёт, повтор через половину интервала;
 *  - «хорошо» → бокс +1;
 *  - «легко»  → бокс +2.
 */
export function rateCard(card: Flashcard, rating: CardRating, today: string): Flashcard {
  let box: number;
  switch (rating) {
    case 'again':
      return { ...card, box: 1, nextReview: today };
    case 'hard':
      box = Math.max(1, card.box);
      return { ...card, box, nextReview: addDays(today, Math.max(1, Math.floor(BOX_INTERVAL_DAYS[box] / 2))) };
    case 'good':
      box = Math.min(MAX_BOX, card.box + 1);
      return { ...card, box, nextReview: addDays(today, BOX_INTERVAL_DAYS[box]) };
    case 'easy':
      box = Math.min(MAX_BOX, card.box + 2);
      return { ...card, box, nextReview: addDays(today, BOX_INTERVAL_DAYS[box]) };
  }
}

export function isDue(card: Flashcard, today: string): boolean {
  return card.nextReview <= today;
}
