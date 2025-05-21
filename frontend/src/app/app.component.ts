import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { User } from './_models/user';
import { AccountService } from './_services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'frontend';
  http = inject(HttpClient);
  accountSrv = inject(AccountService);
  users: any;

  ngOnInit(): void {
    // this.http.get("https://localhost:5001/api/users").subscribe({
    //   next: response => this.users = response
    // });
    this.setCurrentUser();
  }

  setCurrentUser() {
    const user: User = JSON.parse(localStorage.getItem("user"));
    this.accountSrv.setCurrentUser(user);
  }
}
