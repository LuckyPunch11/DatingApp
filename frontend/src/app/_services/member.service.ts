import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { map, take } from 'rxjs';
import { PaginatedResult } from '../_models/paginations';
import { UserParams } from '../_models/user-params';
import { AccountService } from './account.service';
import { User } from '../_models/user';

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

  private getPaginationHeaders(pageNumber: number, pageSize: number) {
    let params = new HttpParams();

    params = params.append('pageNumber', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());

    return params;
  }

  private getPaginatedResult<T>(url, params) {
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();
    return this.http.get<T>(url, { observe: 'response', params }).pipe(
      map(response => {
        paginatedResult.result = response.body;
        const headers = response.headers.get('Pagination');
        if (headers !== null) {
          paginatedResult.pagination = JSON.parse(headers);
        }
        return paginatedResult;
      })
    );
  }

  getMembers(userParams: UserParams) {
    let params = this.getPaginationHeaders(userParams.pageNumber, userParams.pageSize);

    params = params.append('minAge', userParams.minAge.toString());
    params = params.append('maxAge', userParams.maxAge.toString());
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);

    return this.getPaginatedResult<Member[]>(`${this.baseUrl}/users`, params);
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
    let params = this.getPaginationHeaders(pageNumber, pageSize);
    params = params.append('predicate', predicate);
    return this.getPaginatedResult<Partial<Member[]>>(`${this.baseUrl}/likes?predicate=${predicate}`, params);
  }
}
