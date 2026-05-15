"use client";
import { useState, useEffect } from "react";
export function useLocalStorage<T>(key: string, initValue: T) {
  const [value, setValue] = useState<T>(initValue);
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored) as unknown;
        if (Array.isArray(parsed)) {
          // Sincronizamos React con localStorage, el caso de uso legítimo para useEffect
          // eslint-disable-next-line
          setValue(parsed as T);
        }
      }
    } catch (error) {
      console.error("Error reading from localStorage:", error);
    }
    setIsLoaded(true);
  }, [key]);
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error("Error writing to localStorage:", error);
      }
    }
  }, [key, value, isLoaded]);
  return [value, setValue, isLoaded] as const;
}
