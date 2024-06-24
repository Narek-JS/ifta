import { useEffect, useState } from 'react';

export const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set a timer to update the debounced value after the specified delay.
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up function to clear the timer when the value or delay changes
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  // Return the debounced value.
  return debouncedValue;
};