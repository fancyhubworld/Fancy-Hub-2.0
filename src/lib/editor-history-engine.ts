export interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}

export function createHistoryState<T>(initialState: T): HistoryState<T> {
  return {
    past: [],
    present: initialState,
    future: [],
  };
}

export function pushHistory<T>(history: HistoryState<T>, nextState: T, maxHistoryLength = 30): HistoryState<T> {
  return {
    past: [...history.past.slice(-maxHistoryLength), history.present],
    present: nextState,
    future: [], // clear redo stack on new modification
  };
}

export function undoHistory<T>(history: HistoryState<T>): HistoryState<T> {
  if (history.past.length === 0) return history;

  const previous = history.past[history.past.length - 1];
  const newPast = history.past.slice(0, history.past.length - 1);

  return {
    past: newPast,
    present: previous,
    future: [history.present, ...history.future],
  };
}

export function redoHistory<T>(history: HistoryState<T>): HistoryState<T> {
  if (history.future.length === 0) return history;

  const next = history.future[0];
  const newFuture = history.future.slice(1);

  return {
    past: [...history.past, history.present],
    present: next,
    future: newFuture,
  };
}

export interface AutosaveDraftRecord<T> {
  pageId: string;
  data: T;
  lastSavedAt: string;
}

export function saveLocalAutosaveDraft<T>(key: string, data: T): void {
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      const record: AutosaveDraftRecord<T> = {
        pageId: key,
        data,
        lastSavedAt: new Date().toISOString(),
      };
      localStorage.setItem(`fancyhub_autosave_${key}`, JSON.stringify(record));
    } catch {}
  }
}

export function getLocalAutosaveDraft<T>(key: string): AutosaveDraftRecord<T> | null {
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      const raw = localStorage.getItem(`fancyhub_autosave_${key}`);
      return raw ? JSON.parse(raw) : null;
    } catch {}
  }
  return null;
}
