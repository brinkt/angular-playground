import { Component, OnInit, AfterViewInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/debounceTime';

import { AuthUser, AuthService } from '../auth.service';
import { ToastService } from '../../toast/toast.service';

import { suggestUser } from '../../users/user.service';

export class RegisterUser {
  constructor(
    public name: string = '',
    public username: string = '',
    public email: string = '',
    public email_confirm: string = '',
    public password: string = '',
    public password_confirm: string = ''
  ) {}
}

@Component({
  selector: 'app-auth-register',
  templateUrl: './register.html'
})

export class AuthRegisterComponent implements OnInit, AfterViewInit {
  user: RegisterUser = new RegisterUser();
  @ViewChild('name') name;

  /*---------------------------------------------------------------------------
    form validation messages
  ---------------------------------------------------------------------------*/

  validationMessages = {
    'name': {
      'required': 'Name is required.'
    },
    'email': {
      'required': 'Email is required.',
      'email': 'Email format is not valid.',
      'equalTo': 'Email confirmation must match.'
    },
    'email_confirm': {
      'required': 'Email is required.',
      'email': 'Email format is not valid.',
      'equalTo': 'Email confirmation must match.'
    },
    'password_confirm': {
      'required': 'Password is required.',
      'equalTo': 'Password confirmation must match.'
    }
  };

  /*-------------------------------------------------------------------------*/

  constructor(
    private http: HttpClient,
    private router: Router,
    private auth: AuthService,
    private ts: ToastService,
    private cdRef: ChangeDetectorRef ) {
  }

  /*---------------------------------------------------------------------------
    ngOnInit:

    redirect if already logged-in
  ---------------------------------------------------------------------------*/

  ngOnInit() {
    this.auth.isAuth().subscribe((authUser: AuthUser) => {
      if (authUser.username) {
        this.ts.enqueue([{key: 'success', value: 'Logged in successfully!'}]);
        this.router.navigate(['/']);
      }
    });
  }

  /*---------------------------------------------------------------------------
    ngAfterViewInit:

    debounce and subscribe to typed changes on: user.name
  ---------------------------------------------------------------------------*/

  ngAfterViewInit() {
    this.name.valueChanges.debounceTime(1000).subscribe((name) => {
      if (name) {
        this.user.username = suggestUser(name);
        // avoid value change after checked error
        this.cdRef.detectChanges();
      }
    });
  }

  /*---------------------------------------------------------------------------
    onSubmit:

    submit the registration request to the backend
  ---------------------------------------------------------------------------*/

  onSubmit() {
    this.http.post('/auth/register.json', JSON.stringify(this.user), {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    }).toPromise().then(data => {
      this.ts.enqueue([{key: 'success',
        value: 'Registration successful! Please check your e-mail.'
      }]);
      this.router.navigate(['/auth/login']);
    }).catch((e) => {
      this.ts.doError(e);
      this.user.email = '';
      this.user.email_confirm = '';
    });
  }

  /*-------------------------------------------------------------------------*/
}
