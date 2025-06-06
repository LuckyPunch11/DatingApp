import { CanActivateFn } from '@angular/router';
import { AccountService } from '../_services/account.service';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
  const accountSrv = inject(AccountService);
  const toastr = inject(ToastrService);

  return accountSrv.currentUser$.pipe(
    map(user => {
      if (user.roles.includes('Admin') || user.roles.includes('Moderator')) {
        return true;
      }
      toastr.error('You cannot enter this area');
      return false;
    })
  )
};
