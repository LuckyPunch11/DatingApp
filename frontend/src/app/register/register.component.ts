import { Component, EventEmitter, inject, Output } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  @Output() cancelRequest = new EventEmitter();
  private accountSrv = inject(AccountService);
  private toastr = inject(ToastrService);
  model: any = {};

  register() {
    this.accountSrv.register(this.model).subscribe({
      next: response => {
        console.log(response);
        this.cancel();
      },
      error: error => this.toastr.error(error.error)
    });
  }

  cancel() {
    this.cancelRequest.emit(false);
  }

}
