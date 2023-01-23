import {Component, NgModule, OnDestroy} from '@angular/core';
import { CommonModule, NgIf, NgForOf } from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import { RouterModule, RouterLink, RouterLinkActive } from '@angular/router';
import {ThemePickerModule} from '../theme-picker';

import {SECTIONS} from '../documentation-items/documentation-items';
import {ThemeStorage} from '../theme-picker/theme-storage/theme-storage';
import {StyleManager} from '../style-manager';
import {HttpClientModule} from '@angular/common/http';
import {Subscription} from 'rxjs';
import {NavigationFocusService} from '../navigation-focus/navigation-focus.service';
import { ThemePicker } from '../theme-picker/theme-picker';
import { VersionPicker } from '../version-picker/version-picker';

const SECTIONS_KEYS = Object.keys(SECTIONS);

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.html',
    styleUrls: ['./navbar.scss'],
    standalone: true,
    imports: [NgIf, MatButtonModule, RouterLink, NgForOf, RouterLinkActive, VersionPicker, ThemePicker]
})
export class NavBar implements OnDestroy {
  private subscriptions = new Subscription();
  isNextVersion = location.hostname.startsWith('next.material.angular.io');
  skipLinkHref: string | null | undefined;
  skipLinkHidden = true;

  constructor(private navigationFocusService: NavigationFocusService) {
    setTimeout(() => this.skipLinkHref = this.navigationFocusService.getSkipLinkHref(), 100);
  }

  get sections() {
    return SECTIONS;
  }

  get sectionKeys() {
    return SECTIONS_KEYS;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}

@NgModule({
    imports: [CommonModule,
    HttpClientModule,
    MatButtonModule,
    MatMenuModule,
    RouterModule,
    ThemePickerModule,
    NavBar],
    exports: [NavBar],
    providers: [StyleManager, ThemeStorage]
})
export class NavBarModule {}
