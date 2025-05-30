import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  baseUrl = environment.apiUrl;
  http = inject(HttpClient);
  members: Member[] = [];

  members$ = this.http.get<Member[]>(`${this.baseUrl}/users`);

  getMembers() {
    if (this.members.length > 0)
      return of(this.members);

    return this.http.get<Member[]>(`${this.baseUrl}/users`).pipe(
      map(members => {
        this.members = members;
        return members;
      })
    )
  }

  getMember(email: string) {
    const member = this.members.find(x => x.email === email);
    if (member !== undefined)
      return of(member);

    return this.http.get<Member>(`${this.baseUrl}/users/${encodeURIComponent(email)}`);
  }

  updateMember(member: Member) {
    return this.http.put(`${this.baseUrl}/users`, member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = member;
      })
    )
  }

  setMainPhoto(photoId: number) {
    return this.http.put(`${this.baseUrl}/users/set-main-photo/${photoId}`, {});
  }

  deletePhoto(photoId: number) {
    return this.http.delete(`${this.baseUrl}/users/delete-photo/${photoId}`);
  }

  addLike(email: string) {
    return this.http.post(`${this.baseUrl}/likes/${email}`, {});
  }

  getLikes(predicate: string) {
    return this.http.get<Partial<Member[]>>(`${this.baseUrl}/likes?predicate=${predicate}`, {});
  }
}
