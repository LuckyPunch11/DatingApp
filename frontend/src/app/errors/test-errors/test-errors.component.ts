import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-test-errors',
  templateUrl: './test-errors.component.html',
  styleUrls: ['./test-errors.component.css']
})
export class TestErrorsComponent {
  baseUrl = 'https://localhost:5001/api';
  http = inject(HttpClient);
  validationErrors: string[] = [];

  get404Error() {
    this.http.get(`${this.baseUrl}/error/not-found`).subscribe({
      next: response => console.log(response),
      error: response => console.log(response)
    })
  }

  get401Error() {
    this.http.get(`${this.baseUrl}/error/auth`).subscribe({
      next: response => console.log(response),
      error: response => console.log(response)
    })
  }

  get400Error() {
    this.http.get(`${this.baseUrl}/error/bad-request`).subscribe({
      next: response => console.log(response),
      error: response => console.log(response)
    })
  }

  get500Error() {
    this.http.get(`${this.baseUrl}/error/server-error`).subscribe({
      next: response => console.log(response),
      error: response => console.log(response)
    })
  }

  get400ValidationError() {
    this.http.post(`${this.baseUrl}/account/register`, {}).subscribe({
      next: response => console.log(response),
      error: response => {
        console.log(response);
        this.validationErrors = response;
      }
    })
  }
}
