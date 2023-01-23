import {Component, HostBinding, NgModule} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { FooterModule, Footer } from '../../shared/footer/footer';
import { RouterModule, Routes, RouterLink } from '@angular/router';

@Component({
    selector: 'app-not-found',
    templateUrl: './not-found.html',
    styleUrls: ['./not-found.scss'],
    standalone: true,
    imports: [MatButtonModule, RouterLink, Footer]
})
export class NotFound {
  @HostBinding('class.main-content') readonly mainContentClass = true;
}

const routes: Routes = [{path: '', component: NotFound}];

@NgModule({
    imports: [MatButtonModule, FooterModule, RouterModule.forChild(routes), NotFound],
    exports: [NotFound]
})
export class NotFoundModule {
}
