import {Component, HostBinding, NgModule, OnInit} from '@angular/core';
import {GuideItems} from '../../shared/guide-items/guide-items';
import {MatListModule} from '@angular/material/list';
import { RouterModule, Routes, RouterLink } from '@angular/router';
import { Footer } from '../../shared/footer/footer';
import { CommonModule, NgForOf } from '@angular/common';
import { NavigationFocus } from '../../shared/navigation-focus/navigation-focus';
import {ComponentPageTitle} from '../page-title/page-title';
import {MatCardModule} from '@angular/material/card';

@Component({
    selector: 'app-guides',
    templateUrl: './guide-list.html',
    styleUrls: ['./guide-list.scss'],
    standalone: true,
    imports: [NavigationFocus, NgForOf, RouterLink, MatCardModule, Footer]
})
export class GuideList implements OnInit {
  @HostBinding('class.main-content') readonly mainContentClass = true;

  constructor(public guideItems: GuideItems, public _componentPageTitle: ComponentPageTitle) {}

  ngOnInit(): void {
    this._componentPageTitle.title = 'Guides';
  }
}

const routes: Routes = [{path: '', component: GuideList}];

@NgModule({
    imports: [CommonModule,
    MatListModule,
    RouterModule.forChild(routes),
    MatCardModule, GuideList],
    exports: [GuideList],
    providers: [GuideItems]
})
export class GuideListModule { }
