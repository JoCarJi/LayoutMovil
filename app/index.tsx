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

import AnalysisResultCard from "../src/components/custom/AnalysisResultCard";
import {
  analizarSolpedDesdeImagen,
  pingBackend,
  ResumenSolped
} from "../src/services/api";

export default function UploadScreen() {
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [loading, setLoading] = useState(false);
  const [resumen, setResumen] = useState<ResumenSolped | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const solicitarPermisoGaleria = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
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

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!pickerResult.canceled) {
      setImage(pickerResult.assets[0]);
      setResumen(null);
      setErrorMsg(null);
    }
  };

  const handleAnalizar = async () => {
    if (!image) {
      Alert.alert("Sin imagen", "Primero selecciona una imagen.");
      return;
    }

    try {
      console.log("IMAGE: ", image)
      setLoading(true);
      setErrorMsg(null);
      const data = await analizarSolpedDesdeImagen({ uri: image.uri });
      setResumen(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(
        err?.message ?? "Ocurrió un error al analizar la imagen."
      );
    } finally {
      setLoading(false);
    }
  };

  /* TEST*/
  const handlePing = async () => {
    try {
      await pingBackend();
    } catch (e) {
      console.log("PING ERROR", e);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Analizar SOLPED
      </Text>
      <Text style={styles.subtitle}>
        Sube una imagen de la SOLPED a registrar
      </Text>

      <View style={styles.imageContainer}>
        {image ? (
          <Image source={{ uri: image.uri }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={{ textAlign: "center", opacity: 0.6, color: "#0f0f0fff" }}>
              No has seleccionado ninguna imagen.
            </Text>
          </View>
        )}
      </View>

      <Button mode="contained" style={styles.button} onPress={pickImage}>
        Elegir imagen
      </Button>
      
      {/* <Button mode="contained" style={styles.button} onPress={handlePing}>
        PING
      </Button> */}


      <Button
        mode="outlined"
        style={styles.button}
        onPress={handleAnalizar}
        disabled={!image || loading}
      >
        <Text style={{color: "#0f0f0fff"}}>Analizar imagen</Text>
      </Button>

      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator />
          <Text style={{ marginTop: 8, color: "#0f0f0fff"}}>Analizando imagen...</Text>
        </View>
      )}

      {errorMsg && (
        <Text style={styles.errorText}>{errorMsg}</Text>
      )}

      <AnalysisResultCard resumen={resumen} />
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
    color: "#0f0f0fff",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 16,
    opacity: 0.8,
    color: "#0f0f0fff",
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
    borderColor: "#525252ff",
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
