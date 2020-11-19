import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from 'src/app/core/authentication/user';
import { environment } from 'src/environments/environment';
import { Offer } from 'src/app/shared/models/offer';

@Injectable({
  providedIn: 'root'
})
export class TrackerService {

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiUrl}/user`);
  }

  getClicksByOfferAndUser(userId: string, offerId): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/redirect/clicks/${userId}/${offerId}`);
  }

  getAllClicks(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/redirect/clicks`);
  }

  getAllOffers(): Observable<Offer[]> {
    return this.http.get<Offer[]>(`${environment.apiUrl}/offer`);
  }

}
