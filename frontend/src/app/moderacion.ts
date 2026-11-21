import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EstadoForo } from './estado-foro';
import { Accion } from './modelo';
import { conTexto, error } from './validacion';

@Component({
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './moderacion.html',
})
export class Moderacion {
  protected readonly foro = inject(EstadoForo);
  protected readonly lista = signal<Accion['tipo']>('Tema');
  protected readonly seleccionado = signal<{ tipo: Accion['tipo']; id: string; texto: string; oculto: boolean } | undefined>(undefined);
  protected readonly aviso = signal('');
  protected readonly error = error;
  protected readonly formulario = inject(FormBuilder).nonNullable.group({
    motivo: ['', [conTexto, Validators.maxLength(300)]],
    confirmar: [false, Validators.requiredTrue],
  });
  protected readonly contenido = computed(() => this.lista() === 'Tema'
    ? this.foro.temas().map(tema => ({ id: tema.id, texto: tema.titulo, autor: tema.autor, oculto: tema.oculto }))
    : this.foro.comentarios().map(comentario => ({ id: comentario.id, texto: comentario.texto, autor: comentario.autor, oculto: comentario.oculto })));

  seleccionar(item: { id: string; texto: string; oculto: boolean }) {
    this.aviso.set('');
    this.formulario.reset();
    this.seleccionado.set({ ...item, tipo: this.lista() });
  }

  ver(tipo: Accion['tipo']) {
    this.lista.set(tipo);
    this.seleccionado.set(undefined);
  }

  aplicar() {
    this.formulario.markAllAsTouched();
    const item = this.seleccionado();
    if (this.formulario.invalid || !item) return;
    if (this.foro.moderar(item.tipo, item.id, this.formulario.controls.motivo.value)) {
      this.aviso.set(item.oculto ? 'Contenido restituido.' : 'Contenido ocultado.');
      this.seleccionado.set(undefined);
      this.formulario.reset();
    }
  }
}
