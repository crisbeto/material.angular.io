import {Component, NgModule, ViewEncapsulation} from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'app-expansion-scene',
    templateUrl: './expansion-scene.html',
    styleUrls: ['./expansion-scene.scss'],
    standalone: true,
    imports: [MatExpansionModule, MatIconModule]
})
export class ExpansionScene {
}

@NgModule({
    imports: [MatExpansionModule,
        MatIconModule, ExpansionScene],
    exports: [ExpansionScene]
})
export class ExpansionSceneModule {}

