import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import { enableProdMode, ErrorHandler, importProvidersFrom } from '@angular/core';
import {environment} from './environments/environment';
import {AppModule} from './app/';
import {unregisterServiceWorkers} from './unregister-service-workers';
import { MaterialDocsApp } from "./app/material-docs-app";
import { NavBarModule } from "./app/shared/navbar";
import { MATERIAL_DOCS_ROUTES } from "./app/routes";
import { RouterModule } from "@angular/router";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule, bootstrapApplication } from "@angular/platform-browser";
import { AnalyticsErrorReportHandler } from "./app/shared/analytics/error-report-handler";
import { LocationStrategy, PathLocationStrategy } from "@angular/common";

const prefersReducedMotion =
  typeof matchMedia === 'function' ? matchMedia('(prefers-reduced-motion)').matches : false;



// Unregister all installed service workers and force reload the page if there was
// an old service worker from a previous version of the docs.
unregisterServiceWorkers()
  .then(hadServiceWorker => hadServiceWorker && location.reload());

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(MaterialDocsApp, {
    providers: [
        importProvidersFrom(BrowserModule, BrowserAnimationsModule.withConfig({ disableAnimations: prefersReducedMotion }), RouterModule.forRoot(MATERIAL_DOCS_ROUTES, {
            scrollPositionRestoration: 'enabled',
            anchorScrolling: 'enabled'
        }), NavBarModule),
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        { provide: ErrorHandler, useClass: AnalyticsErrorReportHandler }
    ]
})
  .catch(err => console.error(err));
