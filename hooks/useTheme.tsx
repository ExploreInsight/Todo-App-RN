import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

// AsyncStorage is React Native’s simple, promise-based API for persisting small bits of data on a user’s device. Think of it as the mobile-app equivalent of the browser’s localStorage, but asynchronous and cross-platform.

export interface ColorScheme {
  bg: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string;
  primary: string;
  success: string;
  warning: string;
  danger: string;
  shadow: string;
  gradients: {
    background: [string, string];
    surface: [string, string];
    primary: [string, string];
    success: [string, string];
    warning: [string, string];
    danger: [string, string];
    muted: [string, string];
    empty: [string, string];
  };
  backgrounds: {
    input: string;
    editInput: string;
  };
  statusBarStyle: "light-content" | "dark-content";
}

const lightColors: ColorScheme = {
  bg: "#fdfdfd",           // very soft background
  surface: "#ffffff",      // clean card surface
  text: "#1a1a1a",         // strong black text
  textMuted: "#6b7280",    // neutral gray for subtasks
  border: "#e5e7eb",       // light border
  primary: "#2563eb",      // calm but vibrant blue (buttons, highlights)
  success: "#16a34a",      // green for completed tasks
  warning: "#eab308",      // amber for pending/deadline soon
  danger: "#dc2626",       // red for delete/overdue
  shadow: "#000000",
  gradients: {
    background: ["#fdfdfd", "#f3f4f6"],
    surface: ["#ffffff", "#f9fafb"],
    primary: ["#2563eb", "#1e40af"],
    success: ["#16a34a", "#15803d"],
    warning: ["#eab308", "#b45309"],
    danger: ["#dc2626", "#991b1b"],
    muted: ["#9ca3af", "#6b7280"],
    empty: ["#f3f4f6", "#e5e7eb"],
  },
  backgrounds: {
    input: "#ffffff",
    editInput: "#f9fafb",
  },
  statusBarStyle: "dark-content" as const,
};

const darkColors: ColorScheme = {
  bg: "#121212",          // dark but not pure black
  surface: "#1e1e1e",     // card surface
  text: "#f5f5f5",        // almost white text
  textMuted: "#9ca3af",   // muted gray
  border: "#2d2d2d",      // subtle border
  primary: "#3b82f6",     // lighter blue for accents
  success: "#22c55e",     // bright green for completed
  warning: "#facc15",     // yellow for warning
  danger: "#ef4444",      // red for errors/deletion
  shadow: "#000000",
  gradients: {
    background: ["#121212", "#1f1f1f"],
    surface: ["#1e1e1e", "#2d2d2d"],
    primary: ["#3b82f6", "#1d4ed8"],
    success: ["#22c55e", "#15803d"],
    warning: ["#facc15", "#b45309"],
    danger: ["#ef4444", "#991b1b"],
    muted: ["#4b5563", "#6b7280"],
    empty: ["#2d2d2d", "#374151"],
  },
  backgrounds: {
    input: "#1e1e1e",
    editInput: "#121212",
  },
  statusBarStyle: "light-content" as const,
};


interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  colors: ColorScheme;
}

const ThemeContext = createContext<undefined | ThemeContextType>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // get the user's choice
    AsyncStorage.getItem("darkMode").then((value) => {
      if (value) setIsDarkMode(JSON.parse(value));
    });
  }, []);

  const toggleDarkMode = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    await AsyncStorage.setItem("darkMode", JSON.stringify(newMode));
  };

  const colors = isDarkMode ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};

export default useTheme;