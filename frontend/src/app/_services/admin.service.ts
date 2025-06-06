import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

  getUsersWithRoles() {
    return this.http.get<Partial<User[]>>(`${this.baseUrl}/admin/users-with-roles`);
  }

  updateUserRoles(email: string, roles: string[]) {
    return this.http.post(`${this.baseUrl}/admin/edit-roles/${email}?roles=${roles}`, {});
  }
}
