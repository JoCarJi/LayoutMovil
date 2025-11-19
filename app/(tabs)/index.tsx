// app/(tabs)/index.tsx
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  ActivityIndicator,
  Button,
  Text,
} from "react-native-paper";

// import { black } from "react-native-paper/lib/typescript/styles/themes/v2/colors";
import AnalysisResultCard from "../../components/custom/AnalysisResultCard";
// import { AnalisisRespuesta, analizarImagen } from "../../lib/api";

export default function UploadScreen() {
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<
    // AnalisisRespuesta 
  null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const solicitarPermisoGaleria = async () => {
    const { status } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permiso requerido",
        "Necesitamos acceso a tu galería para seleccionar imágenes."
      );
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const ok = await solicitarPermisoGaleria();
    if (!ok) return;

    const pickerResult =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

    if (!pickerResult.canceled) {
      setImage(pickerResult.assets[0]);
      setResult(null);
      setErrorMsg(null);
    }
  };

  const handleAnalizar = async () => {
    if (!image) {
      Alert.alert("Sin imagen", "Primero selecciona una imagen.");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);
      // const data = await analizarImagen({ uri: image.uri });
      // setResult(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(
        err?.message ?? "Ocurrió un error al analizar la imagen."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Analizar imagen
      </Text>
      <Text style={styles.subtitle}>
        Sube una imagen y la enviaremos a tu servicio de análisis.
      </Text>

      <View style={styles.imageContainer}>
        {image ? (
          <Image
            source={{ uri: image.uri }}
            style={styles.image}
          />
        ) : (
          <View style={styles.placeholder}>
            <Text style={{ textAlign: "center", opacity: 0.6, color: "#706868ff" }}>
              No has seleccionado ninguna imagen.
            </Text>
          </View>
        )}
      </View>

      <Button
        mode="contained"
        style={styles.button}
        onPress={pickImage}
      >
        Elegir imagen
      </Button>

      <Button
        mode="outlined"
        style={styles.button}
        onPress={handleAnalizar}
        disabled={!image || loading}
      >
        Analizar imagen
      </Button>

      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator />
          <Text style={{ marginTop: 8 }}>Analizando imagen...</Text>
        </View>
      )}

      {errorMsg && (
        <Text style={styles.errorText}>{errorMsg}</Text>
      )}

      <AnalysisResultCard result={result} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    textAlign: "center",
    marginBottom: 4,
    color: "#000000ff"
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 16,
    opacity: 0.8,
    color: "#000000ff"
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  image: {
    width: "100%",
    aspectRatio: 4 / 3,
    borderRadius: 12,
  },
  placeholder: {
    width: "100%",
    aspectRatio: 4 / 3,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#706868ff",
    justifyContent: "center",
    padding: 16,
  },
  button: {
    marginVertical: 4,
  },
  loading: {
    marginTop: 16,
    alignItems: "center",
  },
  errorText: {
    marginTop: 12,
    color: "red",
  },
});
