import { Component, Input, AfterViewInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import 'rxjs/add/operator/toPromise';

import { AuthService } from '../auth.service';
import { ToastService } from '../../toast/toast.service';
import { RouteHelper } from '../../shared/route-helper';

@Component({
  selector: 'app-auth-password-change',
  templateUrl: './password-change.html'
})

export class AuthPasswordChangeComponent implements AfterViewInit {
  @Input() user: any;
  token: string;
  routeHelper: RouteHelper = new RouteHelper();

  /*---------------------------------------------------------------------------
    form validation messages
  ---------------------------------------------------------------------------*/

  validationMessages = {
    'current_password': { 'required': 'Password is required.' },
    'new_password': { 'required': 'New password is required.' },
    'password_confirm': {
      'required': 'Password confirmation is required.',
      'equalTo': 'Password confirmation must match.'
    }
  };

  /*-------------------------------------------------------------------------*/

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private router: Router,
    private ts: ToastService ) {
  }

  /*-------------------------------------------------------------------------*/

  ngAfterViewInit() {
    if (!this.user) { this.user = {}; }

    const url: {path: string; params: { token: string }} =
      this.routeHelper.paramsFromUrl(this.router.url);

    if (url.params.token) { this.user['token'] = url.params.token; }
  }

  /*-------------------------------------------------------------------------*/

  onSubmit() {
    this.http.post('/auth/password.json', JSON.stringify(this.user), {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    }).toPromise().then((data: any) => {
      if (data.error) {
        this.ts.doError(data);
      } else {
        this.auth.logout();
        this.ts.enqueue([{key: 'success', value: 'Password changed. Please login'}]);
        this.router.navigate(['/auth/login']);
      }
    }).catch(this.ts.doError);
  }

  /*-------------------------------------------------------------------------*/
}
