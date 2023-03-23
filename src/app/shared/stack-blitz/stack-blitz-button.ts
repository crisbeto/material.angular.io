import {Component, Input, NgModule} from '@angular/core';
import {ExampleData} from '@angular/components-examples';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {StackBlitzWriter} from './stack-blitz-writer';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';

@Component({
  selector: 'stack-blitz-button',
  templateUrl: './stack-blitz-button.html',
})
export class StackBlitzButton {
  exampleData: ExampleData | undefined;
  private _stackBlitzForm: HTMLFormElement|undefined;

  @Input()
  set example(exampleId: string | undefined) {
    if (exampleId) {
      const isTest = exampleId.includes('harness');
      this.exampleData = new ExampleData(exampleId);
      this.stackBlitzWriter
        .constructStackBlitzForm(exampleId, this.exampleData, isTest)
        .then(form => this._stackBlitzForm = form);
    } else {
      this.exampleData = undefined;
    }
  }

  constructor(
    private stackBlitzWriter: StackBlitzWriter,
    private snackBar: MatSnackBar) {}

  openStackBlitz(): void {
    if (this._stackBlitzForm) {
      document.body.appendChild(this._stackBlitzForm);
      this._stackBlitzForm.submit();
      document.body.removeChild(this._stackBlitzForm);
    } else {
      this.snackBar.open('StackBlitz is not ready yet. Please try again in a few seconds.',
          undefined, {duration: 5000});
    }
  }
}

@NgModule({
  imports: [MatTooltipModule, MatButtonModule, MatIconModule, MatSnackBarModule],
  exports: [StackBlitzButton],
  declarations: [StackBlitzButton],
  providers: [StackBlitzWriter],
})
export class StackBlitzButtonModule {}
