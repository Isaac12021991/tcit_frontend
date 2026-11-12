import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DatosExtraidosIA, Post } from '../../models/post.model';
import { PostService } from '../../services/post.service';
import { PostFilterComponent } from '../post-filter/post-filter.component';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    PostFilterComponent
  ],
  templateUrl: './post-list.component.html',
  styles: [`
    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
      margin-bottom: 20px;
    }
    .section-title {
      margin: 0 0 4px;
      font-size: 1.6rem;
      font-weight: 700;
      color: #0d47a1;
    }
    .section-subtitle {
      margin: 0;
      color: #64748b;
      font-size: 0.95rem;
    }
    .new-post-btn {
      height: 46px;
      padding: 0 24px;
      font-size: 0.98rem;
      font-weight: 600;
      background-color: #1565c0 !important;
      color: #ffffff !important;
      border-radius: 10px;
    }
    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 14px;
      padding: 48px;
      background: #ffffff;
      border-radius: 12px;
    }
    .table-card {
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
    }
    .table-responsive {
      overflow-x: auto;
    }
    .posts-table {
      width: 100%;
    }
    th.mat-mdc-header-cell {
      font-weight: 600;
      color: #1e3a8a;
      background: #eff6ff;
      padding: 14px 16px;
    }
    td.mat-mdc-cell {
      padding: 16px;
      vertical-align: top;
      border-bottom: 1px solid #f1f5f9;
    }
    .post-title {
      font-weight: 600;
      font-size: 1rem;
      color: #0f172a;
      margin-bottom: 6px;
    }
    .status-pill {
      display: inline-block;
      font-size: 0.72rem;
      font-weight: 700;
      padding: 2px 10px;
      border-radius: 12px;
      margin-bottom: 4px;
    }
    .status-pending {
      background: #fef3c7;
      color: #92400e;
    }
    .status-completed {
      background: #dcfce7;
      color: #166534;
    }
    .post-uuid {
      font-family: monospace;
      font-size: 0.72rem;
      color: #64748b;
    }
    .post-desc {
      margin: 0;
      color: #475569;
      max-width: 280px;
      line-height: 1.45;
    }
    .base64-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 0.8rem;
      color: #1d4ed8;
      background: #dbeafe;
      padding: 4px 10px;
      border-radius: 14px;
    }
    .base64-badge mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }
    .muted-text {
      color: #94a3b8;
      font-style: italic;
      font-size: 0.85rem;
    }
    .ia-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 10px;
      font-size: 0.82rem;
      max-width: 340px;
    }
    .ia-raw {
      margin: 0;
      font-size: 0.76rem;
      white-space: pre-wrap;
      max-width: 320px;
    }
    .action-buttons {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    .empty-state {
      text-align: center;
      padding: 48px 24px;
      color: #64748b;
    }
    .empty-state mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #94a3b8;
      margin-bottom: 8px;
    }
  `]
})
export class PostListComponent implements OnInit {
  private readonly postService = inject(PostService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  todosLosPosts: Post[] = [];
  postsFiltrados: Post[] = [];
  terminoFiltro = '';
  cargandoLista = false;
  eliminandoId: string | null = null;

  readonly columnasVisibles: string[] = [
    'nombre',
    'descripcion',
    'adjunto',
    'datosExtraidosIA',
    'acciones'
  ];

  // Llamada única a GET /posts durante el ciclo de vida ngOnInit de la vista
  ngOnInit(): void {
    this.cargarPostsOrdenados();
  }

  cargarPostsOrdenados(): void {
    this.cargandoLista = true;
    this.postService.listarPosts().subscribe({
      next: (posts) => {
        const lista = Array.isArray(posts) ? posts : [];
        this.todosLosPosts = this.postService.ordenarPostsDescendente(lista);
        this.aplicarFiltroLocal(this.terminoFiltro);
        this.cargandoLista = false;
      },
      error: () => {
        this.cargandoLista = false;
        this.snackBar.open('Error loading campaigns from the server.', 'Close', {
          duration: 4000
        });
      }
    });
  }

  aplicarFiltroLocal(termino: string): void {
    this.terminoFiltro = termino;
    const criterio = termino.trim().toLowerCase();
    const baseOrdenada = this.postService.ordenarPostsDescendente(this.todosLosPosts);
    if (!criterio) {
      this.postsFiltrados = [...baseOrdenada];
      return;
    }
    this.postsFiltrados = baseOrdenada.filter((post) =>
      post.nombre.toLowerCase().includes(criterio)
    );
  }

  editarPost(post: Post): void {
    const postCompleto = this.postService.normalizarPostParaFormulario(post);
    this.router.navigate(['/posts', postCompleto.id, 'edit'], {
      state: { post: postCompleto }
    });
  }

  eliminarPost(postId: string): void {
    this.eliminandoId = postId;
    this.postService.eliminarPost(postId).subscribe({
      next: () => {
        this.todosLosPosts = this.postService.ordenarPostsDescendente(
          this.todosLosPosts.filter((p) => p.id !== postId)
        );
        this.aplicarFiltroLocal(this.terminoFiltro);
        this.eliminandoId = null;
        this.snackBar.open('Campaign deleted successfully.', 'OK', { duration: 3000 });
      },
      error: () => {
        this.eliminandoId = null;
        this.snackBar.open('Could not delete the campaign.', 'Close', { duration: 4000 });
      }
    });
  }

  esUrlExterna(valor: string | undefined): boolean {
    if (!valor) {
      return false;
    }
    return valor.startsWith('http://') || valor.startsWith('https://');
  }

  obtenerObjetoIA(datos: DatosExtraidosIA | string | null | undefined): DatosExtraidosIA | null {
    if (!datos) {
      return null;
    }
    if (typeof datos === 'object') {
      return datos;
    }
    try {
      return JSON.parse(datos) as DatosExtraidosIA;
    } catch {
      return null;
    }
  }
}
