import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { AuthUser, AuthService } from '../auth.service';
import { ToastService } from '../../toast/toast.service';
import { ModelService } from '../../shared/model/model.service';

interface AccountUser {
  name: string;
  username: string;
  new_username: string;
  postal_code: string;
  email: string;
  email_confirm: string;
  password: string;
  current_password: string;
  new_password: string;
  password_confirm: string;
}

@Component({
  selector: 'app-auth-account',
  templateUrl: './account.html'
})

export class AuthAccountComponent implements OnInit {
  public user: AccountUser = {
    name: '', username: '', new_username: '', postal_code: '', email: '', email_confirm: '',
    password: '', current_password: '', new_password: '', password_confirm: ''
  };

  constructor(
    private auth: AuthService,
    private http: HttpClient,
    private router: Router,
    private ts: ToastService,
    private modelService: ModelService ) {
    this.modelService.setupModel('user', 'users');
  }

  /*-------------------------------------------------------------------------*/

  ngOnInit() {
    this.auth.isAuth().subscribe((authUser: AuthUser) => {
      this.modelService.find(authUser.username).subscribe(
        (data: AccountUser) => this.user = data,
        err => console.log(err)
      );
    });
  }

  /*-------------------------------------------------------------------------*/

  changeUsername() {
    this.http.post('/auth/username.json', JSON.stringify(this.user)).subscribe(
      data => {
        this.auth.logout();
        this.ts.enqueue([{key: 'success', value: 'Username changed. Please login'}]);
        this.router.navigate(['/auth/login']);
      },
      err => this.ts.doError(err)
    );
  }

  /*-------------------------------------------------------------------------*/
}
