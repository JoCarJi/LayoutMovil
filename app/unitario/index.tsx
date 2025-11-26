import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
} from "react-native";
import {
  ActivityIndicator,
  Button,
  Text,
  useTheme
} from "react-native-paper";

import unitarioStyles from "../../src/css/unitarioStyles";
import {
  analizarSolpedDesdeImagen,
} from "../../src/services/api";
import type { ResumenSolped } from "../../src/types/solped";

export default function UnitarioScreen() {
  const router = useRouter();
  const theme = useTheme();

  const [image, setImage] =
    useState<ImagePicker.ImagePickerAsset | null>(null);

  const [loading, setLoading] = useState(false);

  const [resumen, setResumen] =
    useState<ResumenSolped | null>(null);

  const [errorMsg, setErrorMsg] =
    useState<string | null>(null);

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
      setLoading(true);
      setErrorMsg(null);
      const data = await analizarSolpedDesdeImagen({
        uri: image.uri,
      });
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

  const irAResultados = () => {
    if (!resumen) return;
    router.push({
      pathname: "/unitario/resultados",
      params: {
        resumen: JSON.stringify(resumen),
        imageUri: image.uri
      },
    });
  };

  return (
    <ScrollView contentContainerStyle={[
        unitarioStyles.container,
        { backgroundColor: theme.colors.background },
      ]}>
      {/* <Text variant="titleLarge" style={[unitarioStyles.title, { color: theme.colors.onBackground }]}>
        Análisis unitario
      </Text> */}

      <ScrollView
        contentContainerStyle={unitarioStyles.previewBox}
        horizontal={false}
      >
        {image ? (
          <Image
            source={{ uri: image.uri }}
            style={unitarioStyles.image}
          />
        ) : (
          <ScrollView
            contentContainerStyle={[
              unitarioStyles.placeholder,
              { borderColor: theme.colors.outline },
            ]}
            horizontal={false}
          >
            <Text
              style={{
                textAlign: "center",
                opacity: 0.6,
                color: theme.colors.onBackground,
              }}
            >
              Previsualización
            </Text>
          </ScrollView>
        )}
      </ScrollView>

      <Button
        mode="contained"
        style={unitarioStyles.button}
        onPress={pickImage}
      >
        Subir imagen
      </Button>

      <Button
        mode="outlined"
        style={unitarioStyles.button}
        onPress={handleAnalizar}
        disabled={!image || loading}
      >
        Analizar
      </Button>

      {loading && (
        <ScrollView
          contentContainerStyle={unitarioStyles.loading}
        >
          <ActivityIndicator />
          <Text style={{ marginTop: 8 }}>
            Analizando imagen...
          </Text>
        </ScrollView>
      )}

      {errorMsg && (
        <Text style={unitarioStyles.errorText}>
          {errorMsg}
        </Text>
      )}

      <Button
        mode="contained"
        style={[unitarioStyles.button, { marginTop: 16 }]}
        onPress={irAResultados}
        disabled={!resumen}
      >
        Resultados
      </Button>
    </ScrollView>
  );
}
