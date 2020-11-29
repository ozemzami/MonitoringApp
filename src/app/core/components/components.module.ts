import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';



@NgModule({
  declarations: [
    NavbarComponent,
    SidebarComponent,
    ConfirmationDialogComponent
  ],
  exports: [
    NavbarComponent,
    SidebarComponent
    ],
  imports: [
    RouterModule,
    CommonModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule
  ]
})
export class ComponentsModule { }
