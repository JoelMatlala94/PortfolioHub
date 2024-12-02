import React, { createContext, useContext, useState, useEffect } from "react";
import { Appearance, useColorScheme } from "react-native";

export type Theme = "Automatic" | "Light" | "Dark";

interface ThemeContextProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  currentThemeAttributes: {
    tintColor: string | undefined;
    backgroundColor: string;
    textColor: string;
    iconColor: string;
    check: string;
    textShadowColor: string;
  };
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<Theme>("Automatic");
  const [currentThemeAttributes, setCurrentThemeAttributes] = useState({
    backgroundColor: "#f0f0f0",
    textColor: "#000",
    tintColor: "#9146FF",
    iconColor: "#FFF",
    check: "#888",
    textShadowColor: "rgba(0, 0, 0, 0.3)"
  });

  const updateThemeAttributes = (selectedTheme: string) => {
    const attributes =
      selectedTheme === "dark"
        ? { backgroundColor: "#222", textColor: "#fff", tintColor: "#2346be", iconColor: "#FFF", check: "#888", textShadowColor: "rgba(255, 255, 255, 0.3)" }
        : { backgroundColor: "#f0f0f0", textColor: "#000", tintColor: "#2346be", iconColor: "#888", check: "#222", textShadowColor: "rgba(0, 0, 0, 0.3)" };

    setCurrentThemeAttributes(attributes);
  };

  useEffect(() => {
    const selectedTheme = theme === "Automatic" ? systemColorScheme : theme.toLowerCase();
    updateThemeAttributes(selectedTheme);

    if (theme === "Automatic") {
      const subscription = Appearance.addChangeListener(({ colorScheme }) => {
        updateThemeAttributes(colorScheme || "light");
      });
      return () => subscription.remove();
    }
  }, [theme, systemColorScheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, currentThemeAttributes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};