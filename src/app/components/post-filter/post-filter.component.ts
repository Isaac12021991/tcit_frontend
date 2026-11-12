import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-post-filter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './post-filter.component.html',
  styleUrl: './post-filter.component.scss'
})
export class PostFilterComponent {
  @Input() terminoBusqueda = '';
  @Input() totalFiltrados = 0;
  @Input() totalRegistros = 0;
  @Output() terminoBusquedaChange = new EventEmitter<string>();

  emitirCambioFiltro(nuevoValor: string): void {
    this.terminoBusqueda = nuevoValor;
    this.terminoBusquedaChange.emit(nuevoValor);
  }
}

