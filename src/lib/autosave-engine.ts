export interface AutosaveDraft<T = any> {
  slug: string;
  timestamp: number;
  data: T;
  versionLabel?: string;
}

const STORAGE_PREFIX = "fancyhub_builder_autosave_";

/**
 * Saves a page draft to browser local storage
 */
export function saveAutosaveDraft<T>(slug: string, data: T, versionLabel?: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const draft: AutosaveDraft<T> = {
      slug,
      timestamp: Date.now(),
      data,
      versionLabel: versionLabel || `Draft-${new Date().toLocaleTimeString()}`,
    };
    localStorage.setItem(`${STORAGE_PREFIX}${slug}`, JSON.stringify(draft));
    return true;
  } catch (err) {
    console.error("Autosave draft write failed:", err);
    return false;
  }
}

/**
 * Retrieves the autosaved draft for a given page slug
 */
export function getAutosaveDraft<T>(slug: string): AutosaveDraft<T> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${slug}`);
    if (!raw) return null;
    return JSON.parse(raw) as AutosaveDraft<T>;
  } catch (err) {
    console.error("Autosave draft read failed:", err);
    return null;
  }
}

/**
 * Clears the autosaved draft for a given page slug
 */
export function clearAutosaveDraft(slug: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(`${STORAGE_PREFIX}${slug}`);
  } catch (err) {}
}

/**
 * Checks if an autosave draft exists and is newer than server baseline timestamp
 */
export function shouldPromptRestore<T>(slug: string, serverTimestamp?: number): { shouldPrompt: boolean; draft: AutosaveDraft<T> | null } {
  const draft = getAutosaveDraft<T>(slug);
  if (!draft) return { shouldPrompt: false, draft: null };

  if (!serverTimestamp) {
    return { shouldPrompt: true, draft };
  }

  // If local draft is at least 3 seconds newer than server timestamp
  const isNewer = draft.timestamp > serverTimestamp + 3000;
  return { shouldPrompt: isNewer, draft };
}
