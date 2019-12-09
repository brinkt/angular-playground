import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import 'rxjs/add/operator/toPromise';

import { ToastService } from '../../toast/toast.service';

interface AuthHelperResponse {
  success: string;
  redirect: string;
}

@Component({
  selector: 'app-auth-helper',
  templateUrl: './helper.html'
})

/*---------------------------------------------------------------------------*/

export class AuthHelperComponent implements OnInit {
  route: string;
  title: string;

  /*---------------------------------------------------------------------------
    form validation messages
  ---------------------------------------------------------------------------*/

  validationMessages = {
    'email': {
      'required': 'Email is required.',
      'email': 'Email format is not valid.'
    }
  };

  /*-------------------------------------------------------------------------*/

  constructor(
    private http: HttpClient,
    private router: Router,
    private ts: ToastService ) {
  }

  /*---------------------------------------------------------------------------
    ngOnInit(): implement OnInit `ngOnInit` method
  ---------------------------------------------------------------------------*/

  ngOnInit() {
    this.route = this.router.url;
    if ( this.route === '/auth/confirm/instructions' ) {
      this.title = 'Confirmation Instructions';
    } else if ( this.route === '/auth/password/instructions' ) {
      this.title = 'Forgot Password Instructions';
    } else if ( this.route === '/auth/unlock/instructions' ) {
      this.title = 'Unlock Instructions';
    }
  }

  /*---------------------------------------------------------------------------
    login form submit
  ---------------------------------------------------------------------------*/

  onSubmit(values) {
    if ( this.route === '/auth/confirm/instructions' ) {
      this.submitHelp('confirm', values);
    } else if ( this.route === '/auth/password/instructions' ) {
      this.submitHelp('password', values);
    } else if ( this.route === '/auth/unlock/instructions' ) {
      this.submitHelp('unlock', values);
    }
  }

  /*-------------------------------------------------------------------------*/

  submitHelp(kind: string, postData: any) {
    this.http.post('/auth/resend/' + kind + '.json',
      JSON.stringify(postData), {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    }).toPromise().then((data: AuthHelperResponse) => {
      const redirect: string = data.redirect ? data.redirect : '/auth/login';
      this.ts.enqueue([{key: 'success', value: data.success}]);
      this.router.navigate([data.redirect]);
    }).catch(this.ts.doError);
  }

  /*-------------------------------------------------------------------------*/
}
