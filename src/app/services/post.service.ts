import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CrearPostPayload, Post } from '../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = 'http://localhost:8080/posts';

  listarPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiBaseUrl);
  }

  crearPost(payload: CrearPostPayload): Observable<Post> {
    return this.http.post<Post>(this.apiBaseUrl, payload);
  }

  actualizarPost(postId: string, payload: Partial<CrearPostPayload>): Observable<Post> {
    return this.http.put<Post>(`${this.apiBaseUrl}/${encodeURIComponent(postId)}`, payload);
  }

  eliminarPost(postId: string): Observable<Post> {
    return this.http.delete<Post>(`${this.apiBaseUrl}/${encodeURIComponent(postId)}`);
  }
}
