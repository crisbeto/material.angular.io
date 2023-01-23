import { enableProdMode, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { AppComponent } from "./app/app.component";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatMenuModule } from "@angular/material/menu";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { MatDialogModule } from "@angular/material/dialog";
import { MatNativeDateModule } from "@angular/material/core";
import { provideAnimations } from "@angular/platform-browser/animations";
import { BrowserModule, bootstrapApplication } from "@angular/platform-browser";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { DOCUMENT } from "@angular/common";
import { SceneOverlayContainer } from "./app/scene-overlay-container";
import { Platform } from "@angular/cdk/platform";
import { OverlayContainer } from "@angular/cdk/overlay";

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(MatDatepickerModule, BrowserModule, MatNativeDateModule, MatDialogModule, ScrollingModule, MatMenuModule, MatPaginatorModule, MatAutocompleteModule),
        {
            provide: OverlayContainer,
            useFactory: (doc: any, platform: Platform) => new SceneOverlayContainer(doc, platform),
            deps: [DOCUMENT, Platform]
        },
        provideAnimations()
    ]
})
  .catch(err => console.error(err));
