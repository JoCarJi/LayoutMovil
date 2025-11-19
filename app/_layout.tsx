import { Stack } from 'expo-router';
import React from "react";
import { PaperProvider } from "react-native-paper";
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    // <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
    //   <Stack>
    //     <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    //     <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
    //   </Stack>
    //   <StatusBar style="auto" />
    // </ThemeProvider>
    <PaperProvider>
      <Stack>
        {/* Tu layout de tabs */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* Si tu template trae un modal, lo dejamos */}
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      </Stack>
    </PaperProvider>
  );
}
