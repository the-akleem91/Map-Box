import React, { useEffect } from "react";

export function useDebounce<T>(value: T, delay = 500): T {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cancel the timeout if value changes (also on delay change or unmount)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return debouncedValue;
}
