import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {TableOfContents} from './table-of-contents';
import {RouterModule} from '@angular/router';

@NgModule({
    imports: [CommonModule, RouterModule, TableOfContents],
    exports: [TableOfContents]
})
export class TableOfContentsModule { }
