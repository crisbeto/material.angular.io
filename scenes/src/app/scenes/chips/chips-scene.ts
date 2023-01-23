import {Component, NgModule, ViewEncapsulation} from '@angular/core';
import {MatChipsModule} from '@angular/material/chips';

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'app-chips-scene',
    templateUrl: './chips-scene.html',
    styleUrls: ['./chips-scene.scss'],
    standalone: true,
    imports: [MatChipsModule]
})
export class ChipsScene {
}

@NgModule({
    imports: [MatChipsModule, ChipsScene],
    exports: [ChipsScene]
})
export class ChipsSceneModule {}

