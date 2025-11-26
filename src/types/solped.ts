export type LoteStatus = "pending" | "processing" | "done" | "error";

export interface ResumenSolped {
  Cantidad: string[];
  Cantidad_num: number | null;
  Cantidad_texto: string | null;
  Caracteristicas: string[];
  Caracteristicas_texto: string;
  Descripcion: string[];
  Descripcion_texto: string;
  Sustento: string[];
  Sustento_texto: string;
  debug?: Record<string, any>;
}

export interface SolpedBatchItem {
  id: string;
  uri: string;
  nombre: string;
  status: LoteStatus;
  resumenOriginal?: ResumenSolped;
  resumenEditado?: ResumenSolped;
  errorMsg?: string;
  confirmado?: boolean;
}

export interface BackendResponse {
  uploaded_filename: string;
  resumen: ResumenSolped;
}

export interface AnalizarImagenArgs {
  uri: string;
}