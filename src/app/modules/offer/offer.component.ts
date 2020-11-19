import { Component, OnInit } from '@angular/core';
import { Offer } from 'src/app/shared/models/offer';
import { MatDialog } from '@angular/material/dialog';
import { OfferDialogComponent } from './offer-dialog/offer-dialog.component';
import { OfferService } from './offer.service';

@Component({
  selector: 'app-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.scss']
})
export class OfferComponent implements OnInit {

  offers: Offer[];
  displayedColumns: string[] = ['id', 'name', 'link', 'unsub'];

  constructor(public dialog: MatDialog, private offerService: OfferService) { }

  ngOnInit() {
    this.offerService.getAllOffers()
    .subscribe(offers => this.offers = offers);
  }

  showLinks(offer) {
    const dialogRef = this.dialog.open(OfferDialogComponent, {
      data: { offer },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
