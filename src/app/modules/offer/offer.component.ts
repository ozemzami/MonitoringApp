import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { AddOfferComponent } from './add-offer/add-offer.component';
import { Component, OnInit } from '@angular/core';
import { Offer } from 'src/app/shared/models/offer';
import { MatDialog } from '@angular/material/dialog';
import { OfferDialogComponent } from './offer-dialog/offer-dialog.component';
import { OfferService } from './offer.service';
import { Role } from 'src/app/core/authentication/role.enum';

@Component({
  selector: 'app-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.scss']
})
export class OfferComponent implements OnInit {

  offers: Offer[];
  displayedColumns: string[] = ['id', 'name', 'link', 'unsub'];
  isAdmin: boolean;

  constructor(public dialog: MatDialog, private offerService: OfferService,
              public authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.isAdmin = this.authenticationService.currentUserValue.role === Role.ADMIN;
    this.offerService.offers.subscribe( offers => this.offers = offers);
    this.offerService.getAllOffers()
    .subscribe(offers => this.offerService.changeOffers(offers));
  }

  showLinks(offer) {
    const dialogRef = this.dialog.open(OfferDialogComponent, {
      data: { offer },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  addOfferDialog() {
    const dialogRef = this.dialog.open(AddOfferComponent);
  }

  deleteUser(offerId: string) {
    this.offerService.deleteOffer(offerId)
    .subscribe(() => {
      const removedUser = this.offers.filter( offer => offer.id !== offerId);
      this.offerService.changeOffers(removedUser);
    });
  }

}
