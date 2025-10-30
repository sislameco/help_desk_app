import { ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withRouterConfig,
  withViewTransitions,
} from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ToastNoAnimationModule } from 'ngx-toastr';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { fakeBackendInterceptor } from '@core/interceptors/fake-backend.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHighlightOptions } from 'ngx-highlightjs';
import { tokenInterceptor } from '@core/interceptors/token.interceptor';
import { NgxSpinnerModule } from 'ngx-spinner';
import { spinnerInterceptor } from '@core/interceptors/spinner-interceptor';
import { errorHandlingInterceptor } from '@core/interceptors/error-handler-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // 👇 This tells Angular “I am zoneless, don’t expect Zone.js”
    // provideZonelessChangeDetection(),

    provideRouter(
      routes,
      withViewTransitions(),
      withComponentInputBinding(),
      withRouterConfig({ paramsInheritanceStrategy: 'always' }),
    ),

    provideHttpClient(
      withInterceptors([
        ...(environment.useMockBackend ? [fakeBackendInterceptor] : []),
        tokenInterceptor,
        spinnerInterceptor,
        errorHandlingInterceptor,
      ]),
    ),

    importProvidersFrom([
      TooltipModule.forRoot(),
      ToastNoAnimationModule.forRoot(),
      NgxSpinnerModule.forRoot(),
    ]),

    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideAnimations(),
    provideHighlightOptions({
      coreLibraryLoader: () => import('highlight.js/lib/core'),
      lineNumbersLoader: () => import('ngx-highlightjs/line-numbers'), // Optional, add line numbers if needed
      languages: {
        typescript: () => import('highlight.js/lib/languages/typescript'),
        css: () => import('highlight.js/lib/languages/css'),
        xml: () => import('highlight.js/lib/languages/xml'),
      },
      themePath: 'path-to-theme.css', // Optional, useful for dynamic theme changes
    }),
  ],
};
