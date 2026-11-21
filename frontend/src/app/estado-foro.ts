import { Injectable, computed, signal } from '@angular/core';
import { Accion, Comentario, Credencial, Cuenta, Tema, claveDemostracion, comentariosBase, cuentasBase, temasBase } from './modelo';

interface Datos {
  cuentas: Cuenta[];
  temas: Tema[];
  comentarios: Comentario[];
  acciones: Accion[];
}

type ContenidoTema = Pick<Tema, 'categoria' | 'titulo' | 'texto'>;
const claveDatos = 'foro-academico-s5-datos';
const claveSesion = 'foro-academico-s5-cuenta';

function leerDatos(): Datos {
  try {
    const guardado = localStorage.getItem(claveDatos);
    if (guardado) return JSON.parse(guardado) as Datos;
  } catch {
    localStorage.removeItem(claveDatos);
  }
  return { cuentas: cuentasBase, temas: temasBase, comentarios: comentariosBase, acciones: [] };
}

async function derivar(clave: string, sal: string): Promise<string> {
  const codificador = new TextEncoder();
  const material = await crypto.subtle.importKey('raw', codificador.encode(clave), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: codificador.encode(sal), iterations: 100000 },
    material, 256,
  );
  return Array.from(new Uint8Array(bits), octeto => octeto.toString(16).padStart(2, '0')).join('');
}

async function proteger(clave: string): Promise<Credencial> {
  const sal = crypto.randomUUID();
  return { sal, hash: await derivar(clave, sal) };
}

@Injectable({ providedIn: 'root' })
export class EstadoForo {
  private readonly datos = signal(leerDatos());
  private readonly sesion = signal(sessionStorage.getItem(claveSesion));
  readonly cuenta = computed(() => this.datos().cuentas.find(cuenta => cuenta.id === this.sesion()));
  readonly temas = computed(() => this.datos().temas);
  readonly comentarios = computed(() => this.datos().comentarios);
  readonly acciones = computed(() => this.datos().acciones);
  readonly visibles = computed(() => this.temas().filter(tema => !tema.oculto));

  nombre(id: string) {
    return this.datos().cuentas.find(cuenta => cuenta.id === id)?.nombre ?? 'Usuario';
  }

  cuentaPorCorreo(correo: string) {
    return this.datos().cuentas.find(cuenta => cuenta.correo === correo.trim().toLowerCase());
  }

  async ingresar(correo: string, clave: string) {
    const cuenta = this.cuentaPorCorreo(correo);
    if (!cuenta) return false;
    const credencial = cuenta.credencial;
    const coincide = credencial ? await derivar(clave, credencial.sal) === credencial.hash : clave === claveDemostracion;
    if (!coincide) return false;
    sessionStorage.setItem(claveSesion, cuenta.id);
    this.sesion.set(cuenta.id);
    return true;
  }

  salir() {
    sessionStorage.removeItem(claveSesion);
    this.sesion.set(null);
  }

  async registrar(nombre: string, correo: string, clave: string) {
    const credencial = await proteger(clave);
    if (this.cuentaPorCorreo(correo)) return false;
    this.guardar(datos => ({
      ...datos, cuentas: [...datos.cuentas, {
        id: crypto.randomUUID(), nombre: nombre.trim(), correo: correo.trim().toLowerCase(), rol: 'USUARIO', credencial,
      }],
    }));
    return true;
  }

  async actualizarClave(id: string, clave: string) {
    const credencial = await proteger(clave);
    this.guardar(datos => ({
      ...datos, cuentas: datos.cuentas.map(cuenta => cuenta.id === id ? { ...cuenta, credencial } : cuenta),
    }));
  }

  actualizarPerfil(nombre: string, correo: string) {
    const actual = this.cuenta();
    const coincidencia = this.cuentaPorCorreo(correo);
    if (!actual || (coincidencia && coincidencia.id !== actual.id)) return false;
    this.guardar(datos => ({
      ...datos, cuentas: datos.cuentas.map(cuenta => cuenta.id === actual.id
        ? { ...cuenta, nombre: nombre.trim(), correo: correo.trim().toLowerCase() } : cuenta),
    }));
    return true;
  }

  publicar(contenido: ContenidoTema, id?: string) {
    const cuenta = this.cuenta();
    if (!cuenta) return undefined;
    const texto = { ...contenido, titulo: contenido.titulo.trim(), texto: contenido.texto.trim() };
    if (id) {
      if (!this.visibles().some(tema => tema.id === id && tema.autor === cuenta.id)) return undefined;
      this.guardar(datos => ({
        ...datos, temas: datos.temas.map(tema => tema.id === id ? { ...tema, ...texto } : tema),
      }));
      return id;
    }
    const tema: Tema = {
      ...texto, id: crypto.randomUUID(), autor: cuenta.id, fecha: new Date().toISOString(), oculto: false,
    };
    this.guardar(datos => ({ ...datos, temas: [tema, ...datos.temas] }));
    return tema.id;
  }

  enviarComentario(tema: string, texto: string, id?: string) {
    const cuenta = this.cuenta();
    if (!cuenta || !this.visibles().some(item => item.id === tema)) return false;
    if (id) {
      if (!this.comentarios().some(item => item.id === id && item.tema === tema && item.autor === cuenta.id && !item.oculto)) return false;
      this.guardar(datos => ({
        ...datos, comentarios: datos.comentarios.map(item => item.id === id ? { ...item, texto: texto.trim() } : item),
      }));
      return true;
    }
    const comentario: Comentario = {
      id: crypto.randomUUID(), texto: texto.trim(), tema, autor: cuenta.id, fecha: new Date().toISOString(), oculto: false,
    };
    this.guardar(datos => ({ ...datos, comentarios: [...datos.comentarios, comentario] }));
    return true;
  }

  eliminarComentario(comentario: Comentario) {
    if (this.cuenta()?.id !== comentario.autor || comentario.oculto) return;
    this.guardar(datos => ({
      ...datos, comentarios: datos.comentarios.filter(item => item.id !== comentario.id),
    }));
  }

  moderar(tipo: Accion['tipo'], id: string, motivo: string) {
    if (this.cuenta()?.rol !== 'ADMINISTRADOR' || !motivo.trim()) return false;
    const item = tipo === 'Tema' ? this.temas().find(tema => tema.id === id)
      : this.comentarios().find(comentario => comentario.id === id);
    if (!item) return false;
    const oculto = !item.oculto;
    const accion: Accion = { tipo, id, motivo: motivo.trim(), oculto, texto: 'titulo' in item ? item.titulo : item.texto, fecha: new Date().toISOString() };
    this.guardar(datos => ({
      ...datos,
      temas: tipo === 'Tema' ? datos.temas.map(tema => tema.id === id ? { ...tema, oculto } : tema) : datos.temas,
      comentarios: tipo === 'Comentario' ? datos.comentarios.map(comentario => comentario.id === id ? { ...comentario, oculto } : comentario) : datos.comentarios,
      acciones: [accion, ...datos.acciones],
    }));
    return true;
  }

  private guardar(cambio: (datos: Datos) => Datos) {
    const siguientes = cambio(this.datos());
    localStorage.setItem(claveDatos, JSON.stringify(siguientes));
    this.datos.set(siguientes);
  }
}
