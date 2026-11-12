import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, switchMap } from 'rxjs';
import { CrearPostPayload, Post } from '../models/post.model';

export interface PostMetadataLocal {
  descripcion: string;
  brief: string;
  adjuntoNombre?: string;
  createdAt: string;
  updatedAt: string;
  ordenSecuencia: number;
}

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = 'http://localhost:8080/posts';
  private readonly storageKey = 'tcit_posts_metadata_v1';
  private readonly seqStorageKey = 'tcit_posts_seq_v1';
  private readonly separadorBrief = '\n\n--- BRIEF ---\n';

  listarPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiBaseUrl).pipe(
      map((posts) => {
        const lista = Array.isArray(posts) ? posts : [];
        const enriquecidos = this.enriquecerYRegistrarPosts(lista);
        return this.ordenarPostsDescendente(enriquecidos);
      })
    );
  }

  obtenerPostPorId(postId: string): Observable<Post | null> {
    return this.listarPosts().pipe(
      map((posts) => posts.find((p) => p.id === postId) ?? null)
    );
  }

  crearPost(payload: CrearPostPayload): Observable<Post> {
    const descripcionLimpia = (payload.descripcion ?? '').trim();
    const briefLimpio = (payload.brief ?? '').trim();
    const descripcionParaBackend = this.construirDescripcionConBrief(descripcionLimpia, briefLimpio);

    const bodyBackend = {
      nombre: payload.nombre.trim(),
      descripcion: descripcionParaBackend,
      brief: briefLimpio,
      adjunto: payload.adjunto ?? ''
    };

    return this.http.post<Post>(this.apiBaseUrl, bodyBackend).pipe(
      map((postCreado) => {
        const ahoraIso = new Date().toISOString();
        const secuencia = this.obtenerSiguienteSecuencia();
        this.guardarMetadataPost(postCreado.id, {
          descripcion: descripcionLimpia,
          brief: briefLimpio || descripcionLimpia,
          adjuntoNombre: payload.adjuntoNombre,
          createdAt: ahoraIso,
          updatedAt: ahoraIso,
          ordenSecuencia: secuencia
        });
        return this.normalizarPostParaFormulario(postCreado);
      })
    );
  }

  actualizarPost(postId: string, payload: Partial<CrearPostPayload>): Observable<Post> {
    const descripcionLimpia = (payload.descripcion ?? '').trim();
    const briefLimpio = (payload.brief ?? '').trim();
    const descripcionParaBackend = this.construirDescripcionConBrief(descripcionLimpia, briefLimpio);
    const metaPrevia = this.leerMapaMetadata()[postId];

    const bodyBackend: CrearPostPayload = {
      nombre: (payload.nombre ?? '').trim(),
      descripcion: descripcionParaBackend,
      brief: briefLimpio,
      adjunto: payload.adjunto ?? '',
      adjuntoNombre: payload.adjuntoNombre ?? metaPrevia?.adjuntoNombre
    };

    return this.http
      .put<Post>(`${this.apiBaseUrl}/${encodeURIComponent(postId)}`, bodyBackend)
      .pipe(
        map((postActualizado) => {
          const ahoraIso = new Date().toISOString();
          const secuencia = this.obtenerSiguienteSecuencia();
          this.guardarMetadataPost(postActualizado.id || postId, {
            descripcion: descripcionLimpia,
            brief: briefLimpio || descripcionLimpia,
            adjuntoNombre: bodyBackend.adjuntoNombre,
            createdAt: metaPrevia?.createdAt ?? ahoraIso,
            updatedAt: ahoraIso,
            ordenSecuencia: secuencia
          });
          return this.normalizarPostParaFormulario(postActualizado);
        }),
        catchError(() =>
          this.http.post<Post>(this.apiBaseUrl, bodyBackend).pipe(
            switchMap((nuevoPost) =>
              this.eliminarPost(postId).pipe(
                catchError(() => of(nuevoPost)),
                map(() => {
                  const ahoraIso = new Date().toISOString();
                  const secuencia = this.obtenerSiguienteSecuencia();
                  this.eliminarMetadataPost(postId);
                  this.guardarMetadataPost(nuevoPost.id, {
                    descripcion: descripcionLimpia,
                    brief: briefLimpio || descripcionLimpia,
                    adjuntoNombre: bodyBackend.adjuntoNombre,
                    createdAt: metaPrevia?.createdAt ?? ahoraIso,
                    updatedAt: ahoraIso,
                    ordenSecuencia: secuencia
                  });
                  return this.normalizarPostParaFormulario(nuevoPost);
                })
              )
            )
          )
        )
      );
  }

  eliminarPost(postId: string): Observable<Post> {
    return this.http.delete<Post>(`${this.apiBaseUrl}/${encodeURIComponent(postId)}`).pipe(
      map((postEliminado) => {
        this.eliminarMetadataPost(postId);
        return postEliminado;
      })
    );
  }

  normalizarPostParaFormulario(postInput: Partial<Post>): Post {
    const post = postInput as Partial<Post> & Record<string, unknown>;
    const id = String(post.id ?? post['Id'] ?? '');
    const mapaMeta = this.leerMapaMetadata();
    const meta = id ? mapaMeta[id] : undefined;

    const nombreResuelto = String(
      post.nombre ?? post['Nombre'] ?? post['name'] ?? post['title'] ?? ''
    ).trim();

    const { descripcion, brief } = this.desglosarDescripcionYBrief(post, meta);

    const adjuntoResuelto = String(
      post.adjunto ?? post['Adjunto'] ?? post['attachment'] ?? ''
    );

    const adjuntoNombreResuelto = String(
      post.adjuntoNombre ?? meta?.adjuntoNombre ?? (adjuntoResuelto ? 'Current attachment loaded' : '')
    );

    const createdAtResuelto =
      post.createdAt ??
      post.created_at ??
      (post['fechaCreacion'] as string | undefined) ??
      post.date ??
      meta?.createdAt;

    const updatedAtResuelto =
      post.updatedAt ??
      post.updated_at ??
      (post['fechaActualizacion'] as string | undefined) ??
      meta?.updatedAt ??
      createdAtResuelto;

    return {
      id,
      nombre: nombreResuelto,
      descripcion,
      brief,
      adjunto: adjuntoResuelto,
      adjuntoNombre: adjuntoNombreResuelto,
      datosExtraidosIA: (post.datosExtraidosIA as Post['datosExtraidosIA']) ?? null,
      estadoProcesamiento: String(post.estadoProcesamiento ?? 'PENDIENTE'),
      createdAt: createdAtResuelto,
      created_at: post.created_at ?? createdAtResuelto,
      updatedAt: updatedAtResuelto,
      updated_at: post.updated_at ?? updatedAtResuelto,
      date: post.date ?? updatedAtResuelto,
      ordenSecuencia: post.ordenSecuencia ?? meta?.ordenSecuencia ?? 0
    };
  }

  ordenarPostsDescendente(posts: Post[]): Post[] {
    return [...posts].sort((a, b) => {
      const tiempoA = this.extraerTimestampMs(a);
      const tiempoB = this.extraerTimestampMs(b);

      if (tiempoB !== tiempoA) {
        return tiempoB - tiempoA;
      }

      const seqA = a.ordenSecuencia ?? 0;
      const seqB = b.ordenSecuencia ?? 0;
      if (seqB !== seqA) {
        return seqB - seqA;
      }

      return String(b.id ?? '').localeCompare(String(a.id ?? ''));
    });
  }

  private extraerTimestampMs(postInput: Post): number {
    const post = postInput as Post & Record<string, unknown>;
    const candidatos = [
      post.updatedAt,
      post.updated_at,
      post['fechaActualizacion'],
      post.createdAt,
      post.created_at,
      post['fechaCreacion'],
      post.date
    ];

    for (const valor of candidatos) {
      if (typeof valor === 'number' && !Number.isNaN(valor)) {
        return valor;
      }
      if (typeof valor === 'string' && valor.trim() !== '') {
        const parseado = Date.parse(valor);
        if (!Number.isNaN(parseado)) {
          return parseado;
        }
      }
    }

    return 0;
  }

  private enriquecerYRegistrarPosts(posts: Post[]): Post[] {
    const mapaMeta = this.leerMapaMetadata();
    let huboCambios = false;
    const baseEpochMs = 1700000000000;

    const resultado = posts.map((post, index) => {
      const registroRaw = post as Partial<Post> & Record<string, unknown>;
      const id = String(post.id ?? '');
      if (id && !mapaMeta[id]) {
        const { descripcion, brief } = this.desglosarDescripcionYBrief(registroRaw, undefined);
        const timestampInicial = new Date(baseEpochMs + (posts.length - index) * 1000).toISOString();
        mapaMeta[id] = {
          descripcion,
          brief,
          createdAt: String(
            post.createdAt ?? post.created_at ?? post.date ?? timestampInicial
          ),
          updatedAt: String(
            post.updatedAt ?? post.updated_at ?? post.createdAt ?? post.created_at ?? timestampInicial
          ),
          ordenSecuencia: posts.length - index
        };
        huboCambios = true;
      }
      return this.normalizarPostParaFormulario(post);
    });

    if (huboCambios) {
      this.escribirMapaMetadata(mapaMeta);
    }

    return resultado;
  }

  private construirDescripcionConBrief(descripcion: string, brief: string): string {
    if (!brief || descripcion.includes('--- BRIEF ---')) {
      return descripcion;
    }
    if (!descripcion) {
      return brief;
    }
    return `${descripcion}${this.separadorBrief}${brief}`;
  }

  private desglosarDescripcionYBrief(
    post: Partial<Post> & Record<string, unknown>,
    meta?: PostMetadataLocal
  ): { descripcion: string; brief: string } {
    const textoBrutoDescripcion = String(
      post.descripcion ?? post['Descripcion'] ?? post['description'] ?? ''
    ).trim();

    const briefExplicito = String(
      post.brief ?? post['Brief'] ?? post['campaignBrief'] ?? post['resumenBrief'] ?? ''
    ).trim();

    let descripcionFinal = textoBrutoDescripcion;
    let briefFinal = briefExplicito;

    const marcadorRegex = /\n*\s*---\s*BRIEF\s*---\s*\n*/i;
    if (marcadorRegex.test(textoBrutoDescripcion)) {
      const partes = textoBrutoDescripcion.split(marcadorRegex);
      descripcionFinal = (partes[0] ?? '').trim();
      const briefEnDescripcion = partes.slice(1).join('\n').trim();
      if (!briefFinal && briefEnDescripcion) {
        briefFinal = briefEnDescripcion;
      }
    }

    if (!descripcionFinal && meta?.descripcion) {
      descripcionFinal = meta.descripcion;
    }

    if (!briefFinal && meta?.brief) {
      briefFinal = meta.brief;
    }

    if (!briefFinal && descripcionFinal) {
      briefFinal = descripcionFinal;
    }

    if (!descripcionFinal && briefFinal) {
      descripcionFinal = briefFinal;
    }

    return {
      descripcion: descripcionFinal.slice(0, 300),
      brief: briefFinal.slice(0, 300)
    };
  }

  private leerMapaMetadata(): Record<string, PostMetadataLocal> {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) {
        return {};
      }
      return JSON.parse(raw) as Record<string, PostMetadataLocal>;
    } catch {
      return {};
    }
  }

  private escribirMapaMetadata(mapa: Record<string, PostMetadataLocal>): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(mapa));
    } catch {
      // Ignorar si localStorage no está disponible
    }
  }

  private guardarMetadataPost(postId: string, meta: PostMetadataLocal): void {
    if (!postId) {
      return;
    }
    const mapa = this.leerMapaMetadata();
    mapa[postId] = meta;
    this.escribirMapaMetadata(mapa);
  }

  private eliminarMetadataPost(postId: string): void {
    if (!postId) {
      return;
    }
    const mapa = this.leerMapaMetadata();
    if (mapa[postId]) {
      delete mapa[postId];
      this.escribirMapaMetadata(mapa);
    }
  }

  private obtenerSiguienteSecuencia(): number {
    try {
      const actual = Number(localStorage.getItem(this.seqStorageKey) ?? '1000');
      const siguiente = Number.isNaN(actual) ? 1001 : actual + 1;
      localStorage.setItem(this.seqStorageKey, String(siguiente));
      return siguiente;
    } catch {
      return Date.now();
    }
  }
}
