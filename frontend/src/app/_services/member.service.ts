import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  baseUrl = environment.apiUrl;
  http = inject(HttpClient);

  members$ = this.http.get<Member[]>(`${this.baseUrl}/users`);

  getMembers() {
    return this.http.get<Member[]>(`${this.baseUrl}/users`);
  }

  getMember(email: string) {
    return this.http.get<Member>(`${this.baseUrl}/users/${encodeURIComponent(email)}`);
  }
}
