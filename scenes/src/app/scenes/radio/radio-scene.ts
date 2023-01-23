import {Component, NgModule, ViewEncapsulation} from '@angular/core';
import {MatRadioModule} from '@angular/material/radio';

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'app-radio-scene',
    templateUrl: './radio-scene.html',
    styleUrls: ['./radio-scene.scss'],
    standalone: true,
    imports: [MatRadioModule]
})
export class RadioScene {
}

@NgModule({
    imports: [MatRadioModule, RadioScene],
    exports: [RadioScene]
})
export class RadioSceneModule {
}

