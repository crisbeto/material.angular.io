import {Component, NgModule} from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';

@Component({
    selector: 'app-tabs-scene',
    templateUrl: './tabs-scene.html',
    styleUrls: ['./tabs-scene.scss'],
    standalone: true,
    imports: [MatTabsModule]
})
export class TabsScene {
}

@NgModule({
    imports: [MatTabsModule, TabsScene],
    exports: [TabsScene]
})
export class TabsSceneModule {
}

