import {Component, NgModule, ViewEncapsulation} from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'app-input-scene',
    templateUrl: './input-scene.html',
    styleUrls: ['./input-scene.scss'],
    standalone: true,
    imports: [MatFormFieldModule, MatInputModule]
})
export class InputScene {
}



