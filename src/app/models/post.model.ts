export interface DatosExtraidosIA {
  objetivo: string;
  audienciaObjetivo: string;
  canales?: string[];
  canalesSugeridos?: string[];
  tonoComunicacion?: string;
  mensajesClave?: string[];
  kpis?: string[];
  kpisEstimados?: string[];
  presupuestoEstimado?: string;
  resumenEjecutivo?: string;
  modoPrivacidad?: string;
  politicaPrivacidad?: string;
}

export interface Post {
  id: string;
  nombre: string;
  descripcion: string;
  brief?: string;
  adjunto: string;
  adjuntoNombre?: string;
  datosExtraidosIA: DatosExtraidosIA | string | null;
  estadoProcesamiento?: string;
  createdAt?: string | number;
  created_at?: string | number;
  updatedAt?: string | number;
  updated_at?: string | number;
  date?: string | number;
  ordenSecuencia?: number;
}

export interface CrearPostPayload {
  nombre: string;
  descripcion: string;
  brief?: string;
  adjunto: string;
  adjuntoNombre?: string;
}
