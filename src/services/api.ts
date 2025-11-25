import { AnalizarImagenArgs, BackendResponse, ResumenSolped } from "@/types/solped";
import { Platform } from "react-native";

// URL de servidor
const API_BASE_URL = "http://192.168.0.8:5000";

export async function analizarSolpedDesdeImagen(
  { uri }: AnalizarImagenArgs
): Promise<ResumenSolped> {
  const formData = new FormData();

  if (Platform.OS === "web") {
    const resp = await fetch(uri);
    const blob = await resp.blob();

    formData.append("file", blob, "solped.png");
  } else {
    const fileToUpload: any = {
      uri,
      name: "solped.png",
      type: "image/png",
    };

    formData.append("file", fileToUpload);
  }

  const response = await fetch(`${API_BASE_URL}/predict_coords`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Error ${response.status}: ${text}`);
  }

  const json = (await response.json()) as BackendResponse;
  return json.resumen;
}

// export async function pingBackend(): Promise<any> {
//   console.log("PING TO:", `${API_BASE_URL}/health`);

//   const res = await fetch(`${API_BASE_URL}/health`);
//   const json = await res.json();
//   console.log("HEALTH:", json);
//   return json;
// }