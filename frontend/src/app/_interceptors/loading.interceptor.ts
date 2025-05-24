import { inject, Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { delay, finalize, Observable } from 'rxjs';
import { BusyService } from '../_services/busy.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private busySrv = inject(BusyService);

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.busySrv.busy();
    return next.handle(request).pipe(
      delay(1000),
      finalize(() => {
        this.busySrv.idle();
      })
    )
  }
}
