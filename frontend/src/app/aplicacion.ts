import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { EstadoForo } from './estado-foro';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './aplicacion.html',
})
export class Aplicacion {
  protected readonly foro = inject(EstadoForo);
  private readonly router = inject(Router);

  salir() {
    this.foro.salir();
    void this.router.navigateByUrl('/');
  }
}
