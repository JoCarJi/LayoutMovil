// components/AnalysisResultCard.tsx
import React from "react";
import { StyleSheet } from "react-native";
import { Card, Text } from "react-native-paper";
// import type { AnalisisRespuesta } from "../lib/api";

interface Props {
  result: null;
}

const AnalysisResultCard: React.FC<Props> = ({ result }) => {
  if (!result) return null;

  return (
    <Card style={styles.card}>
      <Card.Title title="Resultado del análisis" />
      <Card.Content>
        <Text style={styles.label}>Resumen:</Text>
        <Text>{
        // result.resumen ?? result.message ?? 
            "Sin resumen."}
        </Text>

        {/* {typeof result.confidence === "number" && (
          <>
            <Text style={styles.label}>Confianza:</Text>
            <Text>{(result.confidence * 100).toFixed(2)}%</Text>
          </>
        )} */}
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
