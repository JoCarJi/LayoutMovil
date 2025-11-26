// app/_layout.tsx
import ThemeToggleButton from "@/components/custom/ThemeToggleButton";
import { GrupalProvider } from "@/context/GrupalContext";
import { AppThemeProvider } from "@/theme/AppThemeProvider";
import { Stack } from "expo-router";
import React from "react";

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <GrupalProvider>
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              title: "Análisis de SOLPED",
              headerRight: () => <ThemeToggleButton />,
            }}
          />
          <Stack.Screen
            name="unitario/index"
            options={{
              title: "Análisis unitario",
              headerRight: () => <ThemeToggleButton />,
            }}
          />
          <Stack.Screen
            name="unitario/resultados"
            options={{
              title: "Resultados",
              headerRight: () => <ThemeToggleButton />,
            }}
          />
          <Stack.Screen
            name="grupal/index"
            options={{
              title: "Análisis grupal",
              headerRight: () => <ThemeToggleButton />,
            }}
          />
          <Stack.Screen
            name="grupal/resultados"
            options={{
              title: "Resultados grupal",
              headerRight: () => <ThemeToggleButton />,
            }}
          />
          <Stack.Screen
            name="modal"
            options={{ presentation: "modal" }}
          />
        </Stack>
      </GrupalProvider>
    </AppThemeProvider>
  );
}
