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
  adjunto: string;
  datosExtraidosIA: DatosExtraidosIA | string | null;
  estadoProcesamiento?: string;
}

export interface CrearPostPayload {
  nombre: string;
  descripcion: string;
  adjunto: string;
}
