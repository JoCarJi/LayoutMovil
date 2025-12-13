import { StyleSheet } from "react-native";

const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 4,
    fontWeight: "600",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 24,
    opacity: 0.8,
  },
  button: {
    marginVertical: 8,
    borderRadius: 999,
  },
});

export default homeStyles;
