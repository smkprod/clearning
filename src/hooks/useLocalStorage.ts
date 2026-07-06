import { useEffect, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';

/**
 * useState, зеркалируемый в localStorage. Читает один раз при монтировании
 * (через migrate, чтобы догнать старый формат), пишет при каждом изменении.
 */
export function useLocalStorage<T>(
  key: string,
  createInitial: () => T,
  migrate?: (raw: unknown) => T,
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) {
        const parsed: unknown = JSON.parse(raw);
        return migrate ? migrate(parsed) : (parsed as T);
      }
    } catch (err) {
      console.warn(`Не удалось прочитать «${key}» из localStorage:`, err);
    }
    return createInitial();
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.warn(`Не удалось сохранить «${key}» в localStorage:`, err);
    }
  }, [key, value]);

  return [value, setValue];
}
