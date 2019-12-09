import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor,
  HttpHandler, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private auth: AuthService;

  constructor(private inj: Injector) {}

  /*---------------------------------------------------------------------------
    Intercept an outgoing `HttpRequest`
  ---------------------------------------------------------------------------*/

  intercept(req: HttpRequest<any>,
    next: HttpHandler): Observable<HttpEvent<any>> {

    this.auth = this.inj.get(AuthService);
    let clone: HttpRequest<any> = req.clone();

    const token: string = this.auth.getToken();
    if (token) {
      clone = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }

    return next.handle(clone);
  }

  /*-------------------------------------------------------------------------*/
}
