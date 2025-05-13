import { Component, inject, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';
import { Observable } from 'rxjs';
import { User } from '../_models/user';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};
  accountSrv = inject(AccountService);
  currentUser$: Observable<User>;

  ngOnInit(): void {
    this.currentUser$ = this.accountSrv.currentUser$;
  }

  login() {
    this.accountSrv.login(this.model).subscribe({
      next: response => {
        console.log(response);
      },
      error: error => {
        console.log(error);
      }
    });
  }

  logout() {
    this.accountSrv.logout();
  }

}
