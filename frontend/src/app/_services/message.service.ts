import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { getPaginatedResult, getPaginationHeaders } from './pagination.helper';
import { Message } from '../_models/message';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseUrl = environment.apiUrl;F
  private http = inject(HttpClient);

  getMessages(pageNumber, pageSize, container) {
    let params = getPaginationHeaders(pageNumber, pageSize);
    params = params.append('Container', container);
    return getPaginatedResult<Message[]>(`${this.baseUrl}/messages`, params, this.http);
  }

  getMessageThread(email: string) {
    return this.http.get<Message[]>(`${this.baseUrl}/messages/thread/${email}`);
  }

  sendMessage(email: string, content: string) {
    return this.http.post<Message>(`${this.baseUrl}/messages`, {recipientEmail: email, content});
  }

  deleteMessage(id: number) {
    return this.http.delete(`${this.baseUrl}/messages/${id}`);
  }
}
