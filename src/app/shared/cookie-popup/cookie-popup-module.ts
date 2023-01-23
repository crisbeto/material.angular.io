import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {CookiePopup} from './cookie-popup';

@NgModule({
    imports: [CommonModule, MatButtonModule, CookiePopup],
    exports: [CookiePopup]
})
export class CookiePopupModule {}
