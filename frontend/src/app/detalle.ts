import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EstadoForo } from './estado-foro';
import { Comentario, categorias } from './modelo';
import { conTexto, error, maximoBytes } from './validacion';

@Component({
  imports: [RouterLink, DatePipe, ReactiveFormsModule],
  templateUrl: './detalle.html',
})
export class Detalle {
  private readonly id = inject(ActivatedRoute).snapshot.paramMap.get('id') ?? '';
  protected readonly foro = inject(EstadoForo);
  protected readonly tema = computed(() => this.foro.visibles().find(item => item.id === this.id));
  protected readonly categoria = computed(() => categorias.find(item => item.id === this.tema()?.categoria));
  protected readonly comentarios = computed(() => this.foro.comentarios().filter(item => item.tema === this.id && !item.oculto));
  protected readonly editando = signal<string | undefined>(undefined);
  protected readonly eliminar = signal<string | undefined>(undefined);
  protected readonly estado = signal('');
  protected readonly comentario = new FormControl('', { nonNullable: true, validators: [conTexto, Validators.maxLength(2000), maximoBytes(2000)] });
  protected readonly error = error;

  editar(item: Comentario) {
    this.estado.set('');
    this.editando.set(item.id);
    this.comentario.setValue(item.texto);
  }

  cancelar() {
    this.editando.set(undefined);
    this.comentario.reset();
  }

  enviar() {
    this.comentario.markAsTouched();
    if (this.comentario.invalid) return;
    const eraEdicion = this.editando();
    if (this.foro.enviarComentario(this.id, this.comentario.value, eraEdicion)) {
      this.cancelar();
      this.estado.set(eraEdicion ? 'Comentario actualizado.' : 'Comentario publicado.');
    }
  }

  confirmar(item: Comentario) {
    this.foro.eliminarComentario(item);
    if (this.editando() === item.id) this.cancelar();
    this.eliminar.set(undefined);
    this.estado.set('Comentario eliminado.');
  }
}
