import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EstadoForo } from './estado-foro';
import { claveDemostracion, cuentasBase } from './modelo';
import { claveValida, coinciden, correoValido, error, nombreValido } from './validacion';

type Modo = 'ingresar' | 'registro' | 'recuperar' | 'perfil';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './cuenta.html',
})
export class PaginaCuenta {
  private readonly creador = inject(FormBuilder).nonNullable;
  private readonly ruta = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly foro = inject(EstadoForo);
  protected readonly modo = this.ruta.snapshot.data['modo'] as Modo;
  protected readonly titulo = { ingresar: 'Iniciar sesión', registro: 'Crear cuenta', recuperar: 'Recuperar contraseña', perfil: 'Mi perfil' }[this.modo];
  protected readonly error = error;
  protected readonly mensaje = signal('');
  protected readonly aviso = signal('');
  protected readonly ocupado = signal(false);
  protected readonly codigo = signal<{ usuario: string; valor: string } | undefined>(undefined);

  protected readonly ingreso = this.creador.group({
    correo: ['', correoValido], clave: ['', Validators.required],
  });
  protected readonly registro = this.creador.group({
    nombre: ['', nombreValido], correo: ['', correoValido], clave: ['', claveValida], confirmacion: ['', Validators.required],
  }, { validators: coinciden('clave', 'confirmacion') });
  protected readonly recuperar = this.creador.group({ correo: ['', correoValido] });
  protected readonly cambio = this.creador.group({
    codigo: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]], clave: ['', claveValida], confirmacion: ['', Validators.required],
  }, { validators: coinciden('clave', 'confirmacion') });
  protected readonly perfil = this.creador.group({
    nombre: [this.foro.cuenta()?.nombre ?? '', nombreValido],
    correo: [this.foro.cuenta()?.correo ?? '', correoValido],
  });

  rellenar(rol: 'USUARIO' | 'ADMINISTRADOR') {
    const cuenta = cuentasBase.find(item => item.rol === rol);
    if (cuenta) this.ingreso.setValue({ correo: cuenta.correo, clave: claveDemostracion });
  }

  async iniciar() {
    this.ingreso.markAllAsTouched();
    if (this.ingreso.invalid || this.ocupado()) return;
    await this.ejecutar(async () => {
      const { correo, clave } = this.ingreso.getRawValue();
      if (!await this.foro.ingresar(correo, clave)) {
        this.mensaje.set('El correo o la contraseña son incorrectos.');
        return;
      }
      const volver = this.ruta.snapshot.queryParamMap.get('volver');
      await this.router.navigateByUrl(volver?.startsWith('/') && !volver.startsWith('//') ? volver : '/');
    });
  }

  async crear() {
    this.registro.markAllAsTouched();
    if (this.registro.invalid || this.ocupado()) return;
    await this.ejecutar(async () => {
      const { nombre, correo, clave } = this.registro.getRawValue();
      if (!await this.foro.registrar(nombre, correo, clave)) {
        this.mensaje.set('El correo ya está registrado.');
        return;
      }
      await this.foro.ingresar(correo, clave);
      await this.router.navigateByUrl('/');
    });
  }

  generarCodigo() {
    this.recuperar.markAllAsTouched();
    if (this.recuperar.invalid) return;
    this.mensaje.set('');
    const cuenta = this.foro.cuentaPorCorreo(this.recuperar.controls.correo.value);
    if (!cuenta) {
      this.mensaje.set('No se encontró una cuenta local con ese correo.');
      return;
    }
    const valor = String(100000 + crypto.getRandomValues(new Uint32Array(1))[0] % 900000);
    this.codigo.set({ usuario: cuenta.id, valor });
  }

  async guardarClave() {
    this.cambio.markAllAsTouched();
    if (this.cambio.invalid || this.ocupado()) return;
    const solicitud = this.codigo();
    const { codigo, clave } = this.cambio.getRawValue();
    if (!solicitud || solicitud.valor !== codigo) {
      this.mensaje.set('El código no coincide. Revisa el código de la demostración.');
      return;
    }
    await this.ejecutar(async () => {
      await this.foro.actualizarClave(solicitud.usuario, clave);
      this.codigo.set(undefined);
      this.cambio.reset();
      this.aviso.set('Contraseña actualizada. Ya puedes iniciar sesión.');
    });
  }

  guardarPerfil() {
    this.perfil.markAllAsTouched();
    if (this.perfil.invalid) return;
    const { nombre, correo } = this.perfil.getRawValue();
    this.aviso.set('');
    this.mensaje.set('');
    if (!this.foro.actualizarPerfil(nombre, correo)) {
      this.mensaje.set('El correo pertenece a otra cuenta.');
      return;
    }
    this.aviso.set('Cambios guardados.');
  }

  private async ejecutar(accion: () => Promise<void>) {
    this.mensaje.set('');
    this.aviso.set('');
    this.ocupado.set(true);
    try {
      await accion();
    } catch {
      this.mensaje.set('No se pudo guardar el cambio. Inténtalo nuevamente.');
    } finally {
      this.ocupado.set(false);
    }
  }
}
