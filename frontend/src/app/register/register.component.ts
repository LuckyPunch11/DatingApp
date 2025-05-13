import { Component, EventEmitter, inject, Output } from '@angular/core';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  @Output() cancelRequest = new EventEmitter();
  private accountSrv = inject(AccountService);
  model: any = {};

  register() {
    this.accountSrv.register(this.model).subscribe({
      next: response => {
        console.log(response);
        this.cancel();
      },
      error: error => console.log(error)
    });
  }

  cancel() {
    this.cancelRequest.emit(false);
  }

}
