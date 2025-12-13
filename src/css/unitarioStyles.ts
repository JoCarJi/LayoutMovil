import { StyleSheet } from "react-native";

const unitarioStyles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
    flexGrow: 1,
  },
  title: {
    textAlign: "center",
    marginBottom: 12,
    fontWeight: "600",
  },
  previewBox: {
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
    justifyContent: "center",
    padding: 16,
  },
  button: {
    marginVertical: 4,
    borderRadius: 999,
  },
  loading: {
    marginTop: 12,
    alignItems: "center",
  },
  errorText: {
    marginTop: 8,
    color: "#D32F2F",
  },
});

export default unitarioStyles;
