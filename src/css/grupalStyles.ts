// src/css/grupalStyles.ts
import { StyleSheet } from "react-native";

const grupalStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    marginBottom: 12,
    textAlign: "center",
    fontWeight: "600",
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 999,
  },
  list: {
    marginTop: 8,
    marginBottom: 16,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: "500",
  },
  itemSubtitle: {
    fontSize: 12,
    opacity: 0.7,
  },
  guardarListaButton: {
    marginTop: 8,
    borderRadius: 999,
  },
});

export default grupalStyles;
