import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map, ReplaySubject } from 'rxjs';
import { User } from '../_models/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;
  http = inject(HttpClient);
  private currentUserSource = new ReplaySubject<User>(1);
  currentUser$ = this.currentUserSource.asObservable();
  currentUser = signal<User | null>(null);

  login(model: any) {
    return this.http.post(`${this.baseUrl}/account/login`, model).pipe(
      map((response: User) => {
        const user = response;
        if (user) {
          this.setCurrentUser(user);
        }
      })
    )
  }

  register(model: any) {
    return this.http.post(`${this.baseUrl}/account/register`, model).pipe(
      map((response: User) => {
        const user = response;
        if (user) {
          this.setCurrentUser(user);
        }
      })
    )
  }


  logout() {
    localStorage.removeItem("user");
    this.currentUserSource.next(null);
    this.currentUser.set(null);
  }

  setCurrentUser(user: User) {
    const roles = this.getDecodedToken(user.token).role;
    user.roles = [];
    Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);
    localStorage.setItem("user", JSON.stringify(user));
    this.currentUserSource.next(user);
    this.currentUser.set(user);
  }

  getDecodedToken(token: string) {
    return JSON.parse(atob(token.split('.')[1]));
  }
}
