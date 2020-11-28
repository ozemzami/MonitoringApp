import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/core/authentication/user';
import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private usersSource = new BehaviorSubject<User[]>([]);

  users = this.usersSource.asObservable();

  constructor(private http: HttpClient) { }

  changeUsers(users: User[]) {
    this.usersSource.next(users);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiUrl}/user`);
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/user/add`, user);
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/user/` + userId);
  }
}
