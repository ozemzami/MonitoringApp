import { environment } from 'src/environments/environment';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Property } from 'src/app/shared/models/property';
import { OfferService } from '../offer.service';

@Component({
  selector: 'app-offer-dialog',
  templateUrl: './offer-dialog.component.html',
  styleUrls: ['./offer-dialog.component.scss']
})
export class OfferDialogComponent implements OnInit {
  propertyForm: FormGroup;
  property: Property;
  properties: Property[];
  applicationLink: string;
  unsub: string;
  offerLink: string;
  name: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private authService: AuthenticationService,
              private fb: FormBuilder,
              private offerService: OfferService) { }

  ngOnInit() {
    if( environment.production) {
      this.applicationLink = 'http://95.111.244.144' + environment.apiUrl + '/redirect/click/' + this.data.offer.id +
     '/' + this.authService.currentUserValue.id + '/[email]';
      this.unsub ='http://95.111.244.144' + environment.apiUrl  + '/redirect/unsub/' + this.data.offer.id + '/' + this.authService.currentUserValue.id + '/[email]';
    } else {
      this.applicationLink = environment.apiUrl + '/redirect/click/' + this.data.offer.id +
     '/' + this.authService.currentUserValue.id + '/[email]';
      this.unsub = environment.apiUrl  + '/redirect/unsub/' + this.data.offer.id + '/' + this.authService.currentUserValue.id + '/[email]';
    }
    this.name = this.data.offer.name;
    this.createForm();
    this.getProperties();
  }

  getProperties() {
    this.offerService.getAllPrperties(this.data.offer.id, this.authService.currentUserValue.id )
    .subscribe( data => {
      this.properties = data ;
      this.getMyOfferLink();
     } );
  }

  getMyOfferLink() {
    this.offerLink = this.data.offer.link ;
    if (this.properties.length !== 0) {
      this.offerLink += '?';
      this.properties.forEach((property, index) => {
        if (index > 0) {
          this.offerLink += '&';
        }
        switch (property.value) {
          case 'offerId':
            this.offerLink += property.indexName + '=' + this.data.offer.id;
            break;
          case 'userId':
            this.offerLink += property.indexName + '=' + this.authService.currentUserValue.id ;
            break;
          case 'email':
            this.offerLink += property.indexName + '=[email]';
            break;
        }
      });
    }
  }

  createForm() {
    this.propertyForm = this.fb.group( {
      indexName: ['', [Validators.required]],
      value: ['', [Validators.required]]
    });
  }
  onSubmit() {
    if ( this.propertyForm.invalid ) {return; }
    this.offerService.addProperty(this.propertyForm.value.indexName, this.propertyForm.value.value,
       this.data.offer.id, this.authService.currentUserValue.email )
    .subscribe(data => {
      this.properties.push(data);
      this.getMyOfferLink();
      console.log(data);
    });
  }

  onDelete(property: Property) {
    const id = property.id;
    this.offerService.deleteProperty(id)
    .subscribe( () => {
      this.properties = this.properties.filter( element => element.id !== id );
      this.getMyOfferLink();
    });
  }

}
