import {Component, NgModule, ViewEncapsulation} from '@angular/core';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';


@Component({
    selector: 'app-snack-bar-scene',
    template: '<div class="docs-scene-snackbar-background"></div>',
    styleUrls: ['./snack-bar-scene.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true
})
export class SnackBarScene {
  constructor(snackbar: MatSnackBar) {
    snackbar.open('Message archived', 'Undo');
  }
}


