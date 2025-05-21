import { Component, inject, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';
import { Observable } from 'rxjs';
import { User } from '../_models/user';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};
  private accountSrv = inject(AccountService);
  private router = inject(Router);
  currentUser$: Observable<User>;

  ngOnInit(): void {
    this.currentUser$ = this.accountSrv.currentUser$;
  }

  login() {
    this.accountSrv.login(this.model).subscribe({
      next: response => {
        this.router.navigateByUrl('/members')
      }
    });
  }

  logout() {
    this.accountSrv.logout();
    this.router.navigateByUrl('/');
  }

}
