// src/theme/AppThemeProvider.tsx
import React, { createContext, ReactNode, useContext, useState } from "react";
import {
    MD3DarkTheme,
    MD3LightTheme,
    PaperProvider,
    type MD3Theme,
} from "react-native-paper";
import { palette } from "../constants/colors";

type ColorModeContextType = {
  isDark: boolean;
  toggleTheme: () => void;
};

const ColorModeContext = createContext<ColorModeContextType>({
  isDark: false,
  toggleTheme: () => {},
});

export const useColorMode = () => useContext(ColorModeContext);

const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: palette.primary,
    secondary: palette.secondary,
    tertiary: palette.accent,
    background: palette.background,
    surface: palette.surfaceSoft,
    onPrimary: "#FFFFFF",
    onSecondary: "#FFFFFF",
  },
};

const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  dark: true,
  colors: {
    ...MD3DarkTheme.colors,
    primary: palette.accentSoft,
    secondary: palette.secondary,
    tertiary: palette.accent,
    background: "#1A1020",
    surface: "#2D1B3A",  
    surfaceVariant: "#3A2648",
    outline: palette.secondary,
    onBackground: "#FAFAFA",
    onSurface: "#FAFAFA",
    onSurfaceVariant: "#D3C4E3",
    inverseOnSurface: "#1A1020",
    inverseSurface: "#FAFAFA",
  },
};

export const AppThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => setIsDark((prev) => !prev);
  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ColorModeContext.Provider value={{ isDark, toggleTheme }}>
      <PaperProvider theme={theme}>{children}</PaperProvider>
    </ColorModeContext.Provider>
  );
};
