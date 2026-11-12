import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Post } from '../../models/post.model';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-post-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatSnackBarModule
  ],
  templateUrl: './post-form.component.html',
  styles: [`
    .form-page-wrapper {
      max-width: 780px;
      margin: 0 auto;
    }
    .form-card {
      background: #ffffff;
      border-radius: 14px;
      border-top: 4px solid #1565c0;
      padding: 8px;
    }
    .card-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 1.3rem;
      font-weight: 700;
      color: #0d47a1;
    }
    .post-form {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: 18px;
    }
    .full-width {
      width: 100%;
    }
    .drive-section {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      align-items: center;
      margin-bottom: 8px;
    }
    .uploaded-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 0.85rem;
      color: #15803d;
      background: #dcfce7;
      padding: 4px 10px;
      border-radius: 16px;
    }
    .uploaded-badge mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }
    .progress-bar {
      margin: 8px 0;
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 12px;
    }
    .submit-btn {
      background-color: #1565c0 !important;
      color: #ffffff !important;
      padding: 0 24px;
    }
    .disabled-link {
      pointer-events: none;
      opacity: 0.5;
    }
  `]
})
export class PostFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly postService = inject(PostService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly snackBar = inject(MatSnackBar);

  procesandoGuardado = false;
  leyendoArchivo = false;
  nombreArchivoSeleccionado = '';
  modoEdicion = false;
  postIdEdicion: string | null = null;

  readonly formularioPost = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(300)]],
    descripcion: ['', [Validators.required, Validators.maxLength(300)]],
    brief: ['', [Validators.required, Validators.maxLength(300)]],
    adjunto: ['']
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.modoEdicion = true;
      this.postIdEdicion = idParam;
      const estadoNav = history.state as { post?: Post & { brief?: string } };
      if (estadoNav?.post) {
        this.formularioPost.patchValue({
          nombre: estadoNav.post.nombre,
          descripcion: estadoNav.post.descripcion,
          brief: estadoNav.post.brief ?? '',
          adjunto: estadoNav.post.adjunto
        });
      }
    }
  }

  alSeleccionarArchivo(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const archivo = input.files[0];
    const lector = new FileReader();
    this.leyendoArchivo = true;

    lector.onload = () => {
      const resultadoBase64 = typeof lector.result === 'string' ? lector.result : '';
      this.formularioPost.patchValue({ adjunto: resultadoBase64 });
      this.nombreArchivoSeleccionado = archivo.name;
      this.leyendoArchivo = false;
    };

    lector.onerror = () => {
      this.leyendoArchivo = false;
    };

    lector.readAsDataURL(archivo);
  }

  guardarPost(): void {
    if (this.formularioPost.invalid) {
      this.formularioPost.markAllAsTouched();
      return;
    }

    const valores = this.formularioPost.getRawValue();
    const payload = {
      nombre: valores.nombre.trim(),
      descripcion: valores.descripcion.trim(),
      brief: valores.brief.trim(),
      adjunto: valores.adjunto
    };

    this.procesandoGuardado = true;

    const peticion$ =
      this.modoEdicion && this.postIdEdicion
        ? this.postService.actualizarPost(this.postIdEdicion, payload)
        : this.postService.crearPost(payload);

    peticion$.subscribe({
      next: () => {
        this.procesandoGuardado = false;
        this.snackBar.open('Campaña guardada exitosamente.', 'OK', { duration: 3000 });
        this.router.navigate(['/posts']);
      },
      error: () => {
        this.procesandoGuardado = false;
        this.snackBar.open('Error al guardar el post en el servidor.', 'Cerrar', {
          duration: 4000
        });
      }
    });
  }
}
