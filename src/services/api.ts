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

  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Error ${response.status}: ${text}`);
  }

  return (await response.json()) as BackendResponse;
}

export async function analizarGuardarIA({
  uri,
  origen,
  idLote,
}: {
  uri: string;
  origen: "unitario" | "grupal";
  idLote?: number | null;
}) {
  const formData = new FormData();

  formData.append("origen", origen);
  if (idLote) formData.append("id_lote", String(idLote));

  if (Platform.OS === "web") {
    const resp = await fetch(uri);
    const blob = await resp.blob();
    formData.append("file", blob, "solped.png");
  } else {
    formData.append("file", {
      uri,
      name: "solped.png",
      type: "image/png",
    } as any);
  }

  const res = await fetch(`${API_BASE_URL}/solped/analyze_and_save_ia`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<{
    ok: boolean;
    id_solped: number;
    nombre_archivo: string;
    ruta_imagen: string; // <- la ruta persistente del server
    resumen: ResumenSolped;
  }>;
}

export async function guardarFinal({
  idSolped,
  resumenFinal,
}: {
  idSolped: number;
  resumenFinal: ResumenSolped;
}) {
  const res = await fetch(`${API_BASE_URL}/solped/save_final`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id_solped: idSolped,
      resumen_final: resumenFinal,
    }),
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<{ ok: boolean; id_solped: number }>;
}

export async function crearLote(nombre?: string) {
  const res = await fetch(`${API_BASE_URL}/lote/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre_lote: nombre ?? null }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<{ ok: boolean; id_lote: number }>;
}

