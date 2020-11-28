import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OfferRoutingModule } from './offer-routing.module';
import { OfferComponent } from './offer.component';
import { OfferDialogComponent } from './offer-dialog/offer-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { OfferService } from './offer.service';
import { AddOfferComponent } from './add-offer/add-offer.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';


@NgModule({
  declarations: [OfferComponent, OfferDialogComponent, AddOfferComponent],
  entryComponents: [OfferDialogComponent, AddOfferComponent],
  imports: [
    CommonModule,
    OfferRoutingModule,
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
  ],
  providers: [OfferService]
})
export class OfferModule { }
