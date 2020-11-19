import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Offer } from 'src/app/shared/models/offer';
import { environment } from 'src/environments/environment';
import { Property } from 'src/app/shared/models/property';


@Injectable({
  providedIn: 'root'
})
export class OfferService {

  constructor(private http: HttpClient) { }

  getAllOffers(): Observable<Offer[]> {
    return this.http.get<Offer[]>(`${environment.apiUrl}/offer`);
  }

  addOffer(offer: Offer): Observable<any> {
    return this.http.post(`${environment.apiUrl}/offer/add`, offer);
  }

  getAllPrperties( offerId: string, userId: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/sub/getProperties/${offerId}/${userId}`);
  }

  addProperty(indexName: string, value: string, offerId: string, userEmail: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/sub/addProperty`, {indexName, value, offerId, userEmail });
  }

  deleteProperty(propertyId: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/sub/deleteProperty/` + propertyId);
  }
}
