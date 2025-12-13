import { ResumenSolped } from "@/types/solped";
import React from "react";
import { StyleSheet } from "react-native";
import { Card, Text } from "react-native-paper";

interface Props {
  resumen: ResumenSolped | null;
}

const AnalysisResultCard: React.FC<Props> = ({ resumen }) => {
  if (!resumen) return null;

  const {
    Caracteristicas_texto,
    Sustento_texto,
  } = resumen;

  const desc =
  resumen.Descripcion_texto && resumen.Descripcion_texto.trim() !== ""
    ? resumen.Descripcion_texto
    : resumen.Caracteristicas_texto;

  const cantidad =
    resumen.Cantidad_texto ??
    (resumen.Cantidad_num != null ? String(resumen.Cantidad_num) : "—");


  return (
    <Card style={styles.card}>
      <Card.Title title="Resultado del análisis" />
      <Card.Content>
        <Text style={styles.label}>Descripción:</Text>
        <Text>{desc || "—"}</Text>

        <Text style={styles.label}>Características técnicas:</Text>
        <Text>{Caracteristicas_texto || "—"}</Text>

        <Text style={styles.label}>Cantidad:</Text>
        <Text>{cantidad ?? "—"}</Text>

        <Text style={styles.label}>Sustento del pedido:</Text>
        <Text>{Sustento_texto || "—"}</Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginTop: 16,
  },
  label: {
    marginTop: 8,
    fontWeight: "bold",
  },
});

export default AnalysisResultCard;
