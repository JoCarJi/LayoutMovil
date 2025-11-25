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

export interface BackendResponse {
  uploaded_filename: string;
  resumen: ResumenSolped;
}

export interface AnalizarImagenArgs {
  uri: string;
}