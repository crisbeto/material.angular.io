import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';


import {AppComponent} from './app.component';
import {MatNativeDateModule} from '@angular/material/core';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {OverlayContainer} from '@angular/cdk/overlay';
import {SceneOverlayContainer} from './scene-overlay-container';
import {DOCUMENT} from '@angular/common';
import {MatMenuModule} from '@angular/material/menu';
import {MatPaginatorModule} from '@angular/material/paginator';




import {MatAutocompleteModule} from '@angular/material/autocomplete';






import { Platform } from '@angular/cdk/platform';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    MatDatepickerModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatNativeDateModule,
    MatDialogModule,
    ScrollingModule,
    MatMenuModule,
    MatPaginatorModule,
    MatAutocompleteModule
],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: OverlayContainer,
      useFactory: (doc: any, platform: Platform) => new SceneOverlayContainer(doc, platform),
      deps: [DOCUMENT, Platform]
    }]
})
export class AppModule {
}
