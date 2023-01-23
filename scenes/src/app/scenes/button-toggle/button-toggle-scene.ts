import {Component, NgModule, ViewEncapsulation} from '@angular/core';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatIconModule} from '@angular/material/icon';

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'app-button-toggle-scene',
    templateUrl: './button-toggle-scene.html',
    standalone: true,
    imports: [MatButtonToggleModule, MatIconModule]
})
export class ButtonToggleScene {}

@NgModule({
    imports: [MatButtonToggleModule,
        MatIconModule, ButtonToggleScene],
    exports: [ButtonToggleScene]
})
export class InputSceneModule {}

