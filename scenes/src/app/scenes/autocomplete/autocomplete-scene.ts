import {
  AfterViewInit,
  Component,
  NgModule,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, ɵInternalFormsSharedModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInput, MatInputModule} from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { CommonModule, NgForOf } from '@angular/common';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import { MatOptionModule } from '@angular/material/core';


@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'app-autocomplete-scene',
    templateUrl: './autocomplete-scene.html',
    standalone: true,
    imports: [ɵInternalFormsSharedModule, FormsModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule, ReactiveFormsModule, NgForOf, MatOptionModule]
})
export class AutocompleteScene implements AfterViewInit {
  myControl = new FormControl('');
  options: string[] = ['hello', 'hello world'];

  @ViewChild(MatInput) input!: MatInput;

  ngAfterViewInit() {
    this.input.focus();
  }
}



