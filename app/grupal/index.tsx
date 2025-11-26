// app/grupal/index.tsx
import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, FlatList, TouchableOpacity, View } from "react-native";
import {
    Button,
    Icon,
    IconButton,
    List,
    Text,
    useTheme,
} from "react-native-paper";

import { useGrupal } from "@/context/GrupalContext";
import grupalStyles from "@/css/grupalStyles";
import { analizarSolpedDesdeImagen } from "@/services/api";
import type { SolpedBatchItem } from "@/types/solped";

function crearId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function GrupalScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { items, setItems, updateItem, removeItem, reset } = useGrupal();
  const [analizando, setAnalizando] = useState(false);

  const handleSeleccionar = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        multiple: true,
        type: ["image/*"], // ajusta si luego quieres PDFs
      });

      if (res.canceled) return;

      const nuevos: SolpedBatchItem[] = res.assets.map((asset) => ({
        id: crearId(),
        uri: asset.uri,
        nombre: asset.name ?? "SOLPED",
        status: "pending",
      }));

      setItems([...items, ...nuevos]);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "No se pudieron seleccionar archivos.");
    }
  };

  const handleAnalizar = async () => {
    if (items.length === 0) {
      Alert.alert("Sin archivos", "Primero selecciona una carpeta/archivos.");
      return;
    }

    setAnalizando(true);
    try {
      for (const item of items) {
        if (item.status === "done" || item.status === "processing") continue;

        updateItem(item.id, { status: "processing", errorMsg: undefined });

        try {
          const resumen = await analizarSolpedDesdeImagen({ uri: item.uri });
          updateItem(item.id, {
            status: "done",
            resumenOriginal: resumen,
            resumenEditado: resumen,
          });
        } catch (err: any) {
          console.error(err);
          updateItem(item.id, {
            status: "error",
            errorMsg: err?.message ?? "Error al analizar",
          });
        }
      }
    } finally {
      setAnalizando(false);
    }
  };

  const abrirDetalle = (item: SolpedBatchItem) => {
    if (item.status !== "done" || !item.resumenEditado) return;

    router.push({
      pathname: "/unitario/resultados",
      params: {
        resumen: JSON.stringify(item.resumenEditado),
        batchId: item.id, // para que la pantalla sepa que viene del flujo grupal
      },
    });
  };

  const textoEstado = (item: SolpedBatchItem): string => {
    if (item.status === "pending") return "Pendiente";
    if (item.status === "processing") return "Analizando...";
    if (item.status === "error") return "Error";
    if (item.status === "done" && item.confirmado) return "Guardado";
    if (item.status === "done") return "Analizado";
    return "";
  };

  const handleGuardarLista = () => {
    console.log("CLICK GUARDAR LISTA"); // tu log

    if (items.length === 0) {
        Alert.alert("Sin registros", "No hay SOLPED en la lista.");
        return;
    }

    const noAnalizadas = items.filter((it) => it.status !== "done");
    const noConfirmadas = items.filter(
        (it) => it.status === "done" && !it.confirmado
    );

    if (noAnalizadas.length > 0) {
        Alert.alert(
        "Pendientes",
        "Aún hay SOLPED que no se han analizado."
        );
        return;
    }

    if (noConfirmadas.length > 0) {
        // Nada de botones con callbacks (en web no funcionan)
        Alert.alert(
        "Falta confirmar",
        "Hay SOLPED analizadas que no han sido guardadas individualmente. " +
            "Abre cada una, revisa y presiona 'Guardar y volver'."
        );
        return;
    }

    // Si llegó aquí, todo está analizado y confirmado
    Alert.alert("Guardado exitoso", "Se simuló el guardado en la base.");
    // Si quieres limpiar la lista:
    // reset();
    };


  return (
    <FlatList
      contentContainerStyle={[
        grupalStyles.container,
        { backgroundColor: theme.colors.background },
      ]}
      ListHeaderComponent={
        <>
          <Text
            variant="titleLarge"
            style={[
              grupalStyles.title,
              { color: theme.colors.onBackground },
            ]}
          >
            Análisis grupal
          </Text>

          <View style={grupalStyles.actionsRow}>
            <Button
              mode="outlined"
              style={grupalStyles.actionButton}
              onPress={handleSeleccionar}
              icon="folder"
            >
              Seleccionar carpeta
            </Button>

            <Button
              mode="contained"
              style={grupalStyles.actionButton}
              onPress={handleAnalizar}
              loading={analizando}
              disabled={analizando || items.length === 0}
              icon="play"
            >
              Analizar
            </Button>
          </View>

          {items.length === 0 && (
            <Text style={{ opacity: 0.7, textAlign: "center" }}>
              Aún no has cargado SOLPED.
            </Text>
          )}
        </>
      }
      data={items}
      keyExtractor={(item) => item.id}
      style={grupalStyles.list}
      renderItem={({ item }) => {
        const clickable = item.status === "done";
        return (
          <View style={grupalStyles.itemRow}>
            <TouchableOpacity
              style={grupalStyles.itemInfo}
              onPress={() => clickable && abrirDetalle(item)}
              activeOpacity={clickable ? 0.7 : 1}
            >
              <List.Item
                title={item.nombre}
                description={textoEstado(item)}
                left={() => (
                  <Icon
                    source={
                      item.status === "done"
                        ? "file-check-outline"
                        : item.status === "processing"
                        ? "progress-clock"
                        : item.status === "error"
                        ? "alert-circle-outline"
                        : "file-image"
                    }
                    size={24}
                  />
                )}
                right={() =>
                  item.confirmado ? (
                    <Icon
                      source="check-circle-outline"
                      size={20}
                      color={theme.colors.primary}
                    />
                  ) : null
                }
                titleNumberOfLines={1}
                descriptionNumberOfLines={1}
                style={{ opacity: clickable ? 1 : 0.5 }}
              />
            </TouchableOpacity>

            <IconButton
              icon="trash-can-outline"
              onPress={() => removeItem(item.id)}
            />
          </View>
        );
      }}
      ListFooterComponent={
        items.length > 0 ? (
          <Button
            mode="contained-tonal"
            style={grupalStyles.guardarListaButton}
            onPress={handleGuardarLista}
            icon="content-save"
          >
            Guardar lista
          </Button>
        ) : null
      }
    />
  );
}
