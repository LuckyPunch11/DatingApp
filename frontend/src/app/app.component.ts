import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'frontend';
  http = inject(HttpClient);
  users: any;

  ngOnInit(): void {
    this.http.get("https://localhost:5001/api/users").subscribe({
      next: response => this.users = response
    });
  }
}
