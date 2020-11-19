import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';

import { AppTemplateRoutingModule } from './app-template-routing.module';
import { AppTemplateComponent } from './app-template.component';
import { ComponentsModule } from '../core/components/components.module';

@NgModule({
  declarations: [AppTemplateComponent],
  imports: [
    CommonModule,
    ComponentsModule,
    AppTemplateRoutingModule,
    MatListModule,
    MatSidenavModule,
    MatIconModule,
    MatToolbarModule,
  ]
})
export class AppTemplateModule { }
