import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Image, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

export default function PreviewScreen() {
  const theme = useTheme();
  const params = useLocalSearchParams();
  const imageUri = params.imageUri as string | undefined;

  if (!imageUri) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>No hay imagen para mostrar.</Text>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "black",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        source={{ uri: imageUri }}
        style={{ width: "100%", height: "100%" }}
        resizeMode="contain"
      />
    </View>
  );
}
