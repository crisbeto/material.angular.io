import {Component, HostBinding, NgModule} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { Footer } from '../../shared/footer/footer';
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


