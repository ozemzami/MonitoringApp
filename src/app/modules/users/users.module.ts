import { MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { AddUserComponent } from './add-user/add-user.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [UsersComponent, AddUserComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    MatSelectModule,
    MatDialogModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatTableModule
  ]
})
export class UsersModule { }
