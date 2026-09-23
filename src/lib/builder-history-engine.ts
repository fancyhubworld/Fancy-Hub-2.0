export interface BuilderHistorySnapshot<T = any> {
  id: string;
  timestamp: number;
  description: string;
  state: T;
}

export interface BuilderHistoryManager<T = any> {
  past: BuilderHistorySnapshot<T>[];
  present: T;
  future: BuilderHistorySnapshot<T>[];
  maxHistory: number;
}

/**
 * Creates an initialized history manager with an initial state
 */
export function createHistoryManager<T>(initialState: T, maxHistory: number = 30): BuilderHistoryManager<T> {
  return {
    past: [],
    present: JSON.parse(JSON.stringify(initialState)),
    future: [],
    maxHistory,
  };
}

/**
 * Records a new state change into the history stack and clears future redo stack
 */
export function recordHistoryAction<T>(
  manager: BuilderHistoryManager<T>,
  newState: T,
  actionDescription: string = "State change"
): BuilderHistoryManager<T> {
  const currentSnapshot: BuilderHistorySnapshot<T> = {
    id: `snap_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    timestamp: Date.now(),
    description: actionDescription,
    state: JSON.parse(JSON.stringify(manager.present)),
  };

  const updatedPast = [...manager.past.slice(-(manager.maxHistory - 1)), currentSnapshot];

  return {
    past: updatedPast,
    present: JSON.parse(JSON.stringify(newState)),
    future: [],
    maxHistory: manager.maxHistory,
  };
}

/**
 * Performs Undo, moving present state to future and restoring the last past snapshot
 */
export function performUndo<T>(
  manager: BuilderHistoryManager<T>
): { manager: BuilderHistoryManager<T>; success: boolean; undoneAction?: string } {
  if (manager.past.length === 0) {
    return { manager, success: false };
  }

  const previousSnapshot = manager.past[manager.past.length - 1];
  const newPast = manager.past.slice(0, manager.past.length - 1);

  const futureSnapshot: BuilderHistorySnapshot<T> = {
    id: `snap_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    timestamp: Date.now(),
    description: previousSnapshot.description,
    state: JSON.parse(JSON.stringify(manager.present)),
  };

  const updatedManager: BuilderHistoryManager<T> = {
    past: newPast,
    present: JSON.parse(JSON.stringify(previousSnapshot.state)),
    future: [futureSnapshot, ...manager.future],
    maxHistory: manager.maxHistory,
  };

  return {
    manager: updatedManager,
    success: true,
    undoneAction: previousSnapshot.description,
  };
}

/**
 * Performs Redo, moving present state to past and restoring the next future snapshot
 */
export function performRedo<T>(
  manager: BuilderHistoryManager<T>
): { manager: BuilderHistoryManager<T>; success: boolean; redoneAction?: string } {
  if (manager.future.length === 0) {
    return { manager, success: false };
  }

  const nextSnapshot = manager.future[0];
  const newFuture = manager.future.slice(1);

  const pastSnapshot: BuilderHistorySnapshot<T> = {
    id: `snap_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    timestamp: Date.now(),
    description: nextSnapshot.description,
    state: JSON.parse(JSON.stringify(manager.present)),
  };

  const updatedManager: BuilderHistoryManager<T> = {
    past: [...manager.past.slice(-(manager.maxHistory - 1)), pastSnapshot],
    present: JSON.parse(JSON.stringify(nextSnapshot.state)),
    future: newFuture,
    maxHistory: manager.maxHistory,
  };

  return {
    manager: updatedManager,
    success: true,
    redoneAction: nextSnapshot.description,
  };
}
