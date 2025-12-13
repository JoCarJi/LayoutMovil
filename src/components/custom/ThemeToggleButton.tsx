import { useColorMode } from "@/theme/AppThemeProvider";
import React from "react";
import { IconButton } from "react-native-paper";

const ThemeToggleButton = () => {
  const { isDark, toggleTheme } = useColorMode();

  return (
    <IconButton
      icon={isDark ? "white-balance-sunny" : "moon-waning-crescent"}
      onPress={toggleTheme}
      accessibilityLabel="Cambiar tema claro/oscuro"
    />
  );
};

export default ThemeToggleButton;
