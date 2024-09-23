import { useEffect, useState } from "react";

// Custom hook for debouncing a value with an optional delay (default: 500ms)
export const useDebounce = <T>(value: T, delay: number = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set a timer to update debouncedValue after the specified delay
    const handler = setTimeout(() => setDebouncedValue(value), delay);

    // Cleanup timeout if value or delay changes, or on component unmount
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};
