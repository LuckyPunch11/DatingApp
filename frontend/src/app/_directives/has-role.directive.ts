import { Directive, inject, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';
import { take } from 'rxjs';

@Directive({
  selector: '[appHasRole]'
})
export class HasRoleDirective implements OnInit {
  @Input() appHasRole: string[];
  private user: User;
  private viewContainerRef = inject(ViewContainerRef);
  private templateRef = inject(TemplateRef<any>);
  private accountSrv = inject(AccountService);

  constructor() {
    this.accountSrv.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        this.user = user;
      }
    })
   }

  ngOnInit(): void {
    if (!this.user?.roles || this.user == null) {
      this.viewContainerRef.clear();
      return;
    }

    if (this.user?.roles.some(r => this.appHasRole.includes(r))) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainerRef.clear();
    }
  }

}
