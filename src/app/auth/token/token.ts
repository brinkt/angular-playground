import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import 'rxjs/add/operator/toPromise';

import { ToastService } from '../../toast/toast.service';
import { RouteHelper } from '../../shared/route-helper';

interface AuthTokenResponse {
  success?: string;
  redirect?: string;
  error?: string;
  message?: string;
}

@Component({
  selector: 'app-auth-token-helper',
  templateUrl: './token.html'
})

/*---------------------------------------------------------------------------*/

export class AuthTokenHelperComponent implements OnInit {
  tokenVal = '';
  route: string;
  title: string;

  routeHelper: RouteHelper = new RouteHelper();

  /*---------------------------------------------------------------------------
    form validation messages
  ---------------------------------------------------------------------------*/

  validationMessages = {
    'token': {
      'required': 'Token is required.',
      'minlength': 'Token must be exactly 32 characters long.',
      'maxlength': 'Token must be exactly 32 characters long.'
    }
  };

  /*-------------------------------------------------------------------------*/

  constructor(
    private http: HttpClient,
    private router: Router,
    private ts: ToastService ) {
  }

  /*---------------------------------------------------------------------------
    implement OnInit
  ---------------------------------------------------------------------------*/

  ngOnInit() {
    const url: {path: string; params: { token: string }} =
      this.routeHelper.paramsFromUrl(this.router.url);

    this.route = url.path;
    if (url.params.token) { this.tokenVal = url.params.token; }

    if ( this.route === '/auth/token/email' ) {
      this.title = 'Email Confirmation';
    } else if ( this.route === '/auth/token/password' ) {
      this.title = 'Password Reset';
    } else if ( this.route === '/auth/token/unlock' ) {
      this.title = 'Unlock Account';
    }
  }

  /*---------------------------------------------------------------------------
    login form submit
  ---------------------------------------------------------------------------*/

  onSubmit(values) {
    if ( this.route === '/auth/token/email' ) {
      this.submitHelp('email', values);
    } else if ( this.route === '/auth/token/password' ) {
      this.submitHelp('password', values);
    } else if ( this.route === '/auth/token/unlock' ) {
      this.submitHelp('unlock', values);
    }
  }

  /*-------------------------------------------------------------------------*/

  submitHelp(kind: string, postData: any) {
    this.http.post('/auth/token/' + kind + '.json',
      JSON.stringify(postData), {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    }).toPromise().then((data: AuthTokenResponse) => {
      if (data.success) {
        this.ts.enqueue([{key: 'success', value: data.success}]);
      } else if (data.error) {
        this.ts.enqueue([{key: 'danger', value: data.message}]);
      }

      if (data.redirect) {
        this.router.navigate([data.redirect],
          { queryParams: { token: this.tokenVal }});
      } else {
        this.router.navigate(['/auth/login']);
      }
    }).catch(this.ts.doError);
  }

  /*-------------------------------------------------------------------------*/
}
