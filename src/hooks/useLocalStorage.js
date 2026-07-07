import { useEffect, useState } from "react";

/**
 * Hook simple para persistir estado en localStorage.
 * Guarda automáticamente cada vez que el valor cambia.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Almacenamiento lleno o no disponible: se ignora silenciosamente.
    }
  }, [key, value]);

  return [value, setValue];
}
