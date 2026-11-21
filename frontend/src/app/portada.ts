import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EstadoForo } from './estado-foro';
import { categorias } from './modelo';

@Component({
  imports: [DatePipe, RouterLink],
  templateUrl: './portada.html',
})
export class Portada {
  protected readonly foro = inject(EstadoForo);
  protected readonly categorias = categorias;
  protected readonly categoria = signal('');
  protected readonly texto = signal('');
  protected readonly temas = computed(() => {
    const texto = this.texto().trim().toLowerCase();
    return this.foro.visibles().filter(tema =>
      (!this.categoria() || tema.categoria === this.categoria()) &&
      (tema.titulo.toLowerCase().includes(texto) || tema.texto.toLowerCase().includes(texto)));
  });

  datosCategoria(id: string) {
    return this.categorias.find(categoria => categoria.id === id);
  }

  contar(id: string) {
    return this.foro.comentarios().filter(item => item.tema === id && !item.oculto).length;
  }

  limpiar() {
    this.texto.set('');
    this.categoria.set('');
  }
}
