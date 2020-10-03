import { AuthenticationModule } from './authentication/authentication.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AuthenticationModule,
  ]
})
export class CoreModule { }
