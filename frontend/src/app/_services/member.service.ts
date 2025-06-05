import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { take } from 'rxjs';
import { UserParams } from '../_models/user-params';
import { AccountService } from './account.service';
import { User } from '../_models/user';
import { getPaginatedResult, getPaginationHeaders } from './pagination.helper';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  baseUrl = environment.apiUrl;
  http = inject(HttpClient);
  accountSrv = inject(AccountService);
  private userParams: UserParams;
  user: User;

  constructor() {
    this.accountSrv.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        this.user = user;
        this.userParams = new UserParams();
      }
    });
  }

  get UserParams() {
    return this.userParams;
  }

  set UserParams(params: UserParams) {
    this.userParams = params;
  }

  members$ = this.http.get<Member[]>(`${this.baseUrl}/users`);

  getMembers(userParams: UserParams) {
    let params = getPaginationHeaders(userParams.pageNumber, userParams.pageSize);

    params = params.append('minAge', userParams.minAge.toString());
    params = params.append('maxAge', userParams.maxAge.toString());
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);

    return getPaginatedResult<Member[]>(`${this.baseUrl}/users`, params, this.http);
  }

  getMember(email: string) {
    return this.http.get<Member>(`${this.baseUrl}/users/${encodeURIComponent(email)}`);
  }

  updateMember(member: Member) {
    return this.http.put(`${this.baseUrl}/users`, member);
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

  getLikes(predicate: string, pageNumber, pageSize) {
    let params = getPaginationHeaders(pageNumber, pageSize);
    params = params.append('predicate', predicate);
    return getPaginatedResult<Partial<Member[]>>(`${this.baseUrl}/likes?predicate=${predicate}`, params, this.http);
  }
}
