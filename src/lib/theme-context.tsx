"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ThemeTokens, THEME_PRESETS, getThemeCssVariables } from "@/lib/theme-engine";

interface ThemeContextType {
  theme: ThemeTokens;
  setTheme: (theme: ThemeTokens) => void;
  mode: "light" | "dark" | "glassy";
  setMode: (mode: "light" | "dark" | "glassy") => void;
  applyPreset: (presetKey: string) => void;
  refreshTheme: () => Promise<void>;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeTokens>(THEME_PRESETS["royal-blue"]);
  const [mode, setModeState] = useState<"light" | "dark" | "glassy">("light");
  const [isLoading, setIsLoading] = useState(true);

  const applyCssVariables = (tokens: ThemeTokens) => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const vars = getThemeCssVariables(tokens);
    Object.entries(vars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    // Update class on html element
    const activeMode = tokens.activeMode || "light";
    root.classList.remove("light", "dark", "glassy");
    root.classList.add(activeMode);
  };

  const fetchTheme = async () => {
    try {
      const res = await fetch("/api/public/theme");
      if (res.ok) {
        const data = await res.json();
        if (data.theme) {
          setThemeState(data.theme);
          setModeState(data.theme.activeMode || "light");
          applyCssVariables(data.theme);
        }
      }
    } catch (e) {
      console.warn("Could not load theme from API, using default", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTheme();
  }, []);

  const setTheme = (newTheme: ThemeTokens) => {
    setThemeState(newTheme);
    applyCssVariables(newTheme);
  };

  const setMode = (newMode: "light" | "dark" | "glassy") => {
    setModeState(newMode);
    const updatedTheme = { ...theme, activeMode: newMode };
    setThemeState(updatedTheme);
    applyCssVariables(updatedTheme);

    try {
      localStorage.setItem("fancyhub_theme", newMode);
    } catch (e) {}
  };

  const applyPreset = (presetKey: string) => {
    const preset = THEME_PRESETS[presetKey];
    if (preset) {
      setThemeState(preset);
      setModeState(preset.activeMode);
      applyCssVariables(preset);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        mode,
        setMode,
        applyPreset,
        refreshTheme: fetchTheme,
        isLoading,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeEngine() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeEngine must be used within a ThemeProvider");
  }
  return context;
}
