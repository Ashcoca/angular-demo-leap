import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
// provideHttpClient() - it switches on http for the whole app

import { routes } from './app.routes';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    // Register httpclient once at the application level, 
    // so all components can use it
    provideHttpClient(),
  ]
};
