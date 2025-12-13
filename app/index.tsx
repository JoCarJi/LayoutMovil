import homeStyles from "@/css/homeStyles";
import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();

  return (
    <View
      style={[
        homeStyles.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <Text
        variant="headlineMedium"
        style={[homeStyles.title, { color: theme.colors.onBackground }]}
      >
        ANÁLISIS DE SOLPED
      </Text>

      <Text
        style={[
          homeStyles.subtitle,
          { color: theme.colors.onBackground },
        ]}
      >
        Selecciona la acción a realizar
      </Text>

      <Button
        mode="contained"
        style={homeStyles.button}
        onPress={() => router.push("/unitario")}
      >
        Unitario
      </Button>

      <Button
        mode="outlined"
        style={homeStyles.button}
        onPress={() => router.push("/grupal")}
      >
        Grupal
      </Button>
    </View>
  );
}
