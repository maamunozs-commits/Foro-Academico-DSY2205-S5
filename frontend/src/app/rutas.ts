import { inject } from '@angular/core';
import { CanActivateFn, Router, Routes } from '@angular/router';
import { EstadoForo } from './estado-foro';

const necesitaSesion: CanActivateFn = (_, state) =>
  inject(EstadoForo).cuenta() ? true : inject(Router).createUrlTree(['/ingresar'], { queryParams: { volver: state.url } });

const necesitaAdministrador: CanActivateFn = (_, state) => {
  const cuenta = inject(EstadoForo).cuenta();
  const router = inject(Router);
  if (!cuenta) return router.createUrlTree(['/ingresar'], { queryParams: { volver: state.url } });
  return cuenta.rol === 'ADMINISTRADOR' || router.createUrlTree(['/']);
};

const cuenta = () => import('./cuenta').then(pagina => pagina.PaginaCuenta);
export const rutas: Routes = [
  { path: '', title: 'Temas · Foro Académico', loadComponent: () => import('./portada').then(p => p.Portada) },
  { path: 'ingresar', title: 'Ingresar · Foro Académico', data: { modo: 'ingresar' }, loadComponent: cuenta },
  { path: 'registro', title: 'Registro · Foro Académico', data: { modo: 'registro' }, loadComponent: cuenta },
  { path: 'recuperar', title: 'Recuperar contraseña · Foro Académico', data: { modo: 'recuperar' }, loadComponent: cuenta },
  { path: 'perfil', title: 'Mi perfil · Foro Académico', data: { modo: 'perfil' }, canActivate: [necesitaSesion], loadComponent: cuenta },
  { path: 'publicar', title: 'Publicar tema · Foro Académico', canActivate: [necesitaSesion], loadComponent: () => import('./editor').then(p => p.Editor) },
  { path: 'temas/:id/editar', title: 'Editar tema · Foro Académico', canActivate: [necesitaSesion], loadComponent: () => import('./editor').then(p => p.Editor) },
  { path: 'temas/:id', title: 'Tema · Foro Académico', loadComponent: () => import('./detalle').then(p => p.Detalle) },
  { path: 'moderacion', title: 'Moderación · Foro Académico', canActivate: [necesitaAdministrador], loadComponent: () => import('./moderacion').then(p => p.Moderacion) },
  { path: '**', redirectTo: '' },
];
