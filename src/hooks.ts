import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

export function useWidth() {
  return useSyncExternalStore(
    (callback) => {
      window.addEventListener("resize", callback);
      return () => window.removeEventListener("resize", callback);
    },
    () => document.documentElement.getBoundingClientRect().width,
  );
}

export function useDebounce<TArgs extends unknown[]>(
  timeout: number,
  callback: (...args: TArgs) => void,
) {
  const [handle, setHandle] = useState<number>();

  useEffect(() => {
    if (handle) {
      return () => window.clearTimeout(handle);
    }
  }, [handle]);

  return useCallback(
    (...args: TArgs) => {
      if (handle) {
        window.clearTimeout(handle);
      }
      setHandle(window.setTimeout(() => callback(...args), timeout));
    },
    [handle, setHandle, timeout, callback],
  );
}
