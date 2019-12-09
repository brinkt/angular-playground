import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import 'rxjs/add/operator/toPromise';

import { AuthService } from '../auth.service';
import { ToastService } from '../../toast/toast.service';

interface LoginUser {
  login: string;
  password: string;
  remember: boolean;
}

@Component({
  selector: 'app-auth-login',
  templateUrl: './login.html'
})

export class AuthLoginComponent {
  user: LoginUser = { login: '', password: '', remember: true };

  constructor(
    private http: HttpClient,
    private router: Router,
    private auth: AuthService,
    private ts: ToastService ) {}

  /*---------------------------------------------------------------------------
    login form submit
  ---------------------------------------------------------------------------*/

  onSubmit() {
    this.auth.logout();

    this.http.post('/auth/login.json', JSON.stringify(this.user), {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    }).toPromise().then((data: any) => {
      if (data.error) {
        this.doError(data);
      } else {
        // valid response, check JWT
        if ( this.auth.processLogin(data) ) {
          // valid login
          this.ts.enqueue([{key: 'success', value: 'Login successful!'}]);
          this.router.navigate(['/']);
        } else {
          // invalid token
          this.user.password = '';
          this.ts.enqueue([{key: 'danger', value: 'Invalid JWT! Retry login?'}]);
          this.ts.dequeue();
        }
      }
    }).catch(this.doError);
  }

  /*-------------------------------------------------------------------------*/

  doError(err) {
    if (err.message === 'Please confirm your email.') {
      this.router.navigate(['/auth/token/email']);
    } else {
      this.user.password = '';
    }
    this.ts.doError(err);
  }

  /*-------------------------------------------------------------------------*/
}
