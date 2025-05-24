import { inject, Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class BusyService {
  private spinner = inject(NgxSpinnerService);
  private busyRequestCount = 0;

  busy() {
    this.busyRequestCount++;
    this.spinner.show(undefined, {
      type: 'pacman',
      bdColor: 'rgba(0, 0, 0, 0.8)',
      color: '#ffffff',
      size: 'large'
    })
  }

  idle() {
    this.busyRequestCount--;
    if (this.busyRequestCount <= 0) {
      this.busyRequestCount = 0;
      this.spinner.hide();
    }
  }
}
