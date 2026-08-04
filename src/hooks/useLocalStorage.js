import { useCallback, useSyncExternalStore } from 'react';

/**
 * useLocalStorage(key, initialValue)
 * -----------------------------------
 * A read/write hook for a single localStorage key, mirroring the useState
 * API: const [value, setValue] = useLocalStorage('key', fallback).
 *
 * WHY NOT JUST useState + useEffect?
 * The naive version — useState(() => JSON.parse(localStorage.getItem(key)))
 * plus a useEffect that calls setItem on change — has three real bugs:
 *   1. It throws if the stored value is missing or corrupted JSON.
 *   2. It never notices when a DIFFERENT tab changes the same key, so two
 *      open tabs silently drift out of sync.
 *   3. Under React 18's concurrent rendering, reading an external source
 *      through useState can "tear": two components reading the same key
 *      can briefly disagree about its value within a single render pass,
 *      because the read isn't synchronized with React's render phase.
 *
 * useSyncExternalStore was added in React 18 specifically to fix all three.
 * It forces React to re-check the external value synchronously as part of
 * rendering, and re-renders every subscribed component together whenever
 * the store reports a change — no tearing possible.
 *
 * @param {string} key - the localStorage key to read/write
 * @param {*} initialValue - used the first time this key doesn't exist yet
 * @returns {[value: any, setValue: (next: any | ((prev: any) => any)) => void]}
 */
export function useLocalStorage(key, initialValue) {
  // getSnapshot runs during render, so it must be fast, synchronous, and
  // side-effect-free. It always reads straight from localStorage — never
  // from a cached variable — which is what prevents tearing: there is only
  // ever one source of truth, read fresh every time React asks for it.
  const getSnapshot = useCallback(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? item : JSON.stringify(initialValue);
    } catch (error) {
      // localStorage can throw (private browsing mode, quota exceeded,
      // disabled by the browser). Never let that crash the whole app.
      console.warn(`useLocalStorage: read failed for "${key}"`, error);
      return JSON.stringify(initialValue);
    }
  }, [key, initialValue]);

  // Required by the useSyncExternalStore API for SSR. This project is a
  // pure client-side Vite SPA with no server render pass, so this branch
  // never actually runs — it's here so the hook stays correct if the
  // project ever adds SSR later.
  const getServerSnapshot = useCallback(
    () => JSON.stringify(initialValue),
    [initialValue],
  );

  // subscribe tells React how to listen for changes to the external store.
  // Two event sources are needed:
  //   - the native "storage" event, which the browser fires automatically
  //     in OTHER tabs when localStorage changes (never in the tab that made
  //     the change — that's a browser rule, not a bug).
  //   - a custom "local-storage" event we dispatch ourselves in setValue,
  //     so components in THIS tab also re-render immediately.
  const subscribe = useCallback((callback) => {
    window.addEventListener('storage', callback);
    window.addEventListener('local-storage', callback);
    return () => {
      window.removeEventListener('storage', callback);
      window.removeEventListener('local-storage', callback);
    };
  }, []);

  const rawValue = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  let value;
  try {
    value = JSON.parse(rawValue);
  } catch (error) {
    console.warn(`useLocalStorage: corrupted JSON for "${key}", resetting.`, error);
    value = initialValue;
  }

  // setValue intentionally does NOT close over `value` from this render.
  // Instead it re-reads localStorage fresh at call time. This keeps the
  // function reference stable (useCallback deps are just key/initialValue,
  // which rarely change) so it can be handed to deeply nested memoized
  // children — e.g. ChatMessageCard — without breaking their own
  // memoization, and it also means two rapid calls to setValue can never
  // stomp on each other with stale data.
  const setValue = useCallback(
    (newValue) => {
      try {
        const currentRaw = window.localStorage.getItem(key);
        const currentValue = currentRaw !== null ? JSON.parse(currentRaw) : initialValue;
        const valueToStore =
          newValue instanceof Function ? newValue(currentValue) : newValue;
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        // Notify subscribers in THIS tab (see subscribe() above for why
        // this is necessary — the native event only fires cross-tab).
        window.dispatchEvent(new Event('local-storage'));
      } catch (error) {
        console.error(`useLocalStorage: write failed for "${key}"`, error);
      }
    },
    [key, initialValue],
  );

  return [value, setValue];
}
