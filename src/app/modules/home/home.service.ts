import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http: HttpClient) { }

  getAllClicks(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/redirect/clicks`);
  }
}
