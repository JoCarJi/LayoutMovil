import { AnalizarImagenArgs, BackendResponse, ResumenSolped } from "@/types/solped";
import { Platform } from "react-native";

// URL de servidor
const API_BASE_URL = "http://192.168.0.8:5000";

interface GuardarSolpedArgs {
  origen: "unitario" | "grupal";
  idLote?: number | null;
  nombreArchivo: string;
  rutaImagen: string;
  resumen: ResumenSolped;
}

interface GuardarSolpedResponse {
  ok: boolean;
  id_solped: number;
}


export async function analizarSolpedDesdeImagen(
  { uri }: AnalizarImagenArgs
): Promise<BackendResponse> {
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

  return (await response.json()) as BackendResponse;
}

export async function guardarSolped(
  args: GuardarSolpedArgs
): Promise<GuardarSolpedResponse> {
  const response = await fetch(`${API_BASE_URL}/solped/save`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      origen: args.origen,
      id_lote: args.idLote ?? null,
      nombre_archivo: args.nombreArchivo,
      ruta_imagen: args.rutaImagen,
      resumen: args.resumen,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Error ${response.status}: ${text}`);
  }

  return (await response.json()) as GuardarSolpedResponse;
}


// export async function pingBackend(): Promise<any> {
//   console.log("PING TO:", `${API_BASE_URL}/health`);

//   const res = await fetch(`${API_BASE_URL}/health`);
//   const json = await res.json();
//   console.log("HEALTH:", json);
//   return json;
// }