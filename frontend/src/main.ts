import { bootstrapApplication } from '@angular/platform-browser';
import { configuracion } from './app/configuracion';
import { Aplicacion } from './app/aplicacion';

bootstrapApplication(Aplicacion, configuracion)
  .catch((fallo) => console.error(fallo));
