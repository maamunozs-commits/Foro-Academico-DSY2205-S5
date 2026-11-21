export type Rol = 'USUARIO' | 'ADMINISTRADOR';

export interface Credencial {
  sal: string;
  hash: string;
}

export interface Cuenta {
  id: string;
  nombre: string;
  correo: string;
  rol: Rol;
  credencial?: Credencial;
}

export interface Categoria {
  id: string;
  nombre: string;
  simbolo: string;
  color: string;
}

export interface Tema {
  id: string;
  categoria: string;
  titulo: string;
  texto: string;
  autor: string;
  fecha: string;
  oculto: boolean;
}

export interface Comentario {
  id: string;
  tema: string;
  texto: string;
  autor: string;
  fecha: string;
  oculto: boolean;
}

export interface Accion {
  tipo: 'Tema' | 'Comentario';
  id: string;
  texto: string;
  motivo: string;
  oculto: boolean;
  fecha: string;
}

export const categorias: Categoria[] = [
  { id: 'programacion', nombre: 'Programación', simbolo: '</>', color: 'violeta' },
  { id: 'datos', nombre: 'Bases de datos', simbolo: '▤', color: 'verde' },
  { id: 'web', nombre: 'Desarrollo web', simbolo: '□', color: 'azul' },
  { id: 'seguridad', nombre: 'Ciberseguridad', simbolo: '◇', color: 'ambar' },
  { id: 'ia', nombre: 'Inteligencia artificial', simbolo: '✳', color: 'rosa' },
];

export const claveDemostracion = 'ForoAcademico2026!';

export const cuentasBase: Cuenta[] = [
  { id: 'u1', nombre: 'Matias Muñoz', correo: 'matias.munoz@foro.cl', rol: 'ADMINISTRADOR' },
  { id: 'u2', nombre: 'Camila Soto', correo: 'camila.soto@foro.cl', rol: 'USUARIO' },
  { id: 'u3', nombre: 'Diego Rojas', correo: 'diego.rojas@foro.cl', rol: 'USUARIO' },
];

export const temasBase: Tema[] = [
  { id: 't1', categoria: 'programacion', titulo: 'Organización de proyectos en Java', texto: 'La separación por capas facilita cambios y pruebas. ¿Qué responsabilidad asignarías a los controladores, los servicios y los repositorios en una API?', autor: 'u1', fecha: '2026-11-20T15:30:00Z', oculto: false },
  { id: 't2', categoria: 'datos', titulo: 'Integridad referencial en Oracle', texto: 'Las claves foráneas mantienen la consistencia entre categorías, temas y comentarios. ¿En qué casos conviene usar un índice para estas relaciones?', autor: 'u2', fecha: '2026-11-20T14:30:00Z', oculto: false },
  { id: 't3', categoria: 'web', titulo: 'Diseño de una API REST', texto: 'Estoy revisando el contrato de una API para un foro. ¿Qué criterios usan para decidir entre PUT y PATCH y documentar las respuestas?', autor: 'u3', fecha: '2026-11-20T13:30:00Z', oculto: false },
  { id: 't4', categoria: 'seguridad', titulo: 'Protección de contraseñas con BCrypt', texto: 'Una función de hash con sal protege los registros almacenados. ¿Qué otras medidas conviene aplicar para proteger el inicio de sesión?', autor: 'u1', fecha: '2026-11-19T19:30:00Z', oculto: false },
  { id: 't5', categoria: 'ia', titulo: 'Uso responsable de inteligencia artificial', texto: 'La revisión humana permite identificar errores y evaluar la calidad de respuestas generadas. Compartan un criterio con el que hayan evaluado resultados.', autor: 'u2', fecha: '2026-11-19T16:30:00Z', oculto: false },
  { id: 't6', categoria: 'web', titulo: 'Cuadrículas adaptables con Bootstrap', texto: 'Un listado de publicaciones cambia de una a tres columnas según el ancho disponible. ¿Qué casos revisarían además del tamaño de pantalla?', autor: 'u3', fecha: '2026-11-19T14:30:00Z', oculto: false },
];

export const comentariosBase: Comentario[] = [
  { id: 'c1', tema: 't1', texto: 'La capa de servicio concentra las reglas de negocio. Los controladores traducen la entrada HTTP y devuelven la respuesta.', autor: 'u2', fecha: '2026-11-20T16:30:00Z', oculto: false },
  { id: 'c2', tema: 't2', texto: 'Conviene contrastar el plan de ejecución antes y después de incorporar un índice.', autor: 'u3', fecha: '2026-11-20T17:30:00Z', oculto: false },
  { id: 'c3', tema: 't3', texto: 'Una creación correcta puede responder con HTTP 201 y una cabecera Location.', autor: 'u1', fecha: '2026-11-20T18:30:00Z', oculto: false },
  { id: 'c4', tema: 't4', texto: 'El control de intentos y los mensajes de error genéricos reducen la exposición de las cuentas.', autor: 'u3', fecha: '2026-11-20T16:00:00Z', oculto: false },
  { id: 'c5', tema: 't5', texto: 'Compruebo las afirmaciones relevantes con fuentes primarias antes de utilizar una respuesta.', autor: 'u1', fecha: '2026-11-20T17:00:00Z', oculto: false },
];
