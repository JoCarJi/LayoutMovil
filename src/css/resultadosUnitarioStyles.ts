import { StyleSheet } from "react-native";

const resultadosUnitarioStyles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  input: {
    flex: 1,
  },
  textArea: {
    minHeight: 100,
  },
  emptyText: {
    opacity: 0.6,
    marginBottom: 8,
  },
  divider: {
    marginVertical: 12,
  },
});

export default resultadosUnitarioStyles;
