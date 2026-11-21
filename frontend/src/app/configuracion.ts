import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideRouter, withHashLocation, withInMemoryScrolling } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import locale from '@angular/common/locales/es-CL';
import { rutas } from './rutas';

registerLocaleData(locale);

export const configuracion: ApplicationConfig = {
  providers: [

    provideRouter(rutas, withHashLocation(), withInMemoryScrolling({ scrollPositionRestoration: 'top' })),
    { provide: LOCALE_ID, useValue: 'es-CL' },
  ],
};
