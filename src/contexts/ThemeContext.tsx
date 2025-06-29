// src/contexts/ThemeContext.tsx
import React, { createContext, useContext, ReactNode } from "react";

// Definição do tipo do contexto
interface ThemeContextType {
  colors: {
    background: string;
    cardBackground: string;
    text: string;
    textSecondary: string;
    primary: string;
    primaryLight: string;
    border: string;
    inputBackground: string;
  };
}

// Contexto com valor padrão para evitar verificação de undefined
const ThemeContext = createContext<ThemeContextType>({
  colors: {
    background: "#121212",
    cardBackground: "#1e1e1e",
    text: "#ffffff",
    textSecondary: "#a0a0a0",
    primary: "#7E22CE",
    primaryLight: "#9333EA",
    border: "#333333",
    inputBackground: "#222222",
  },
});

// Hook para usar o tema
export const useTheme = () => useContext(ThemeContext);

// Provider do tema
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => (
  <ThemeContext.Provider
    value={{
      colors: {
        background: "#121212",
        cardBackground: "#1e1e1e",
        text: "#ffffff",
        textSecondary: "#a0a0a0",
        primary: "#7E22CE",
        primaryLight: "#9333EA",
        border: "#333333",
        inputBackground: "#222222",
      },
    }}
  >
    {children}
  </ThemeContext.Provider>
);
