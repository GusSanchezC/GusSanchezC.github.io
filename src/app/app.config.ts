import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'
import { routes } from './app.routes';
import { ModalModule } from 'ngx-bootstrap/modal'

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),provideHttpClient(),importProvidersFrom(ModalModule.forRoot())]
};
