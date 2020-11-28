import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Offer } from 'src/app/shared/models/offer';
import { OfferService } from '../offer.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-add-offer',
  templateUrl: './add-offer.component.html',
  styleUrls: ['./add-offer.component.scss']
})
export class AddOfferComponent implements OnInit {

  offerForm: FormGroup;
  offer: Offer;
  @Input() offers: Offer[];

  constructor(
    private fb: FormBuilder,
    private offerService: OfferService,
    private notificationService: NotificationService) { }

  ngOnInit() {
    this.offerService.offers.subscribe( offers => this.offers = offers);
    this.initForm();
  }

  initForm() {
    this.offerForm = this.fb.group({
      name: ['', Validators.required],
      link: ['', Validators.required],
      unsub: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.offerForm.invalid) { return; }
    this.offer = this.offerForm.value;
    this.offerService.addOffer(this.offer).subscribe(
      (offer) => {
        const message = 'The offer : <b>' + this.offer.name + '</b> has been successfully added';
        this.notificationService.showNotification('bottom', 'left', 'success', message);
        this.offers.push(offer);
        this.offerService.changeOffers(this.offers);
        this.offerForm.reset({
          name: '',
          link: '',
          unsub: ''
        });
      }
    );
  }
}
