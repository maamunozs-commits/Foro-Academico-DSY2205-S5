import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EstadoForo } from './estado-foro';
import { categorias } from './modelo';
import { conTexto, error, maximoBytes } from './validacion';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './editor.html',
})
export class Editor {
  private readonly router = inject(Router);
  private readonly foro = inject(EstadoForo);
  protected readonly id = inject(ActivatedRoute).snapshot.paramMap.get('id');
  protected readonly existente = this.foro.visibles().find(tema => tema.id === this.id && tema.autor === this.foro.cuenta()?.id);
  protected readonly categorias = categorias;
  protected readonly error = error;
  protected readonly aviso = signal('');
  protected readonly formulario = inject(FormBuilder).nonNullable.group({
    categoria: [this.existente?.categoria ?? '', Validators.required],
    titulo: [this.existente?.titulo ?? '', [conTexto, Validators.maxLength(180)]],
    texto: [this.existente?.texto ?? '', [conTexto, Validators.maxLength(4000), maximoBytes(4000)]],
  });

  guardar() {
    this.formulario.markAllAsTouched();
    if (this.formulario.invalid) return;
    const datos = this.formulario.getRawValue();
    if (!categorias.some(categoria => categoria.id === datos.categoria)) {
      this.aviso.set('Selecciona una categoría del foro.');
      return;
    }
    const id = this.foro.publicar(datos, this.id ?? undefined);
    if (id) void this.router.navigate(['/temas', id]);
    else this.aviso.set('No se pudo guardar el tema.');
  }
}
