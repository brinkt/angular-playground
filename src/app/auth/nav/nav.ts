import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthUser, AuthService } from '../auth.service';
import { ToastService } from '../../toast/toast.service';

@Component({
  selector: 'app-auth-nav-component',
  templateUrl: './nav.html'
})
export class AuthNavComponent implements OnInit {
  authenticated = false;
  authUser: AuthUser;

  constructor(
    public auth: AuthService,
    private router: Router,
    private ts: ToastService ) {}

  /*---------------------------------------------------------------------------
    ngOnInit
  ---------------------------------------------------------------------------*/

  ngOnInit() {
    this.auth.isAuth().subscribe((au: AuthUser) => {
      this.setAuth(au);
      this.auth.isAuthPersist.subscribe((au2: AuthUser) => {
        this.setAuth(au2);
      });
    });
  }

  setAuth(au: AuthUser) {
    this.authUser = (au.username) ? au : {};
    this.authenticated = (au.username) ? true : false;
  }

  /*---------------------------------------------------------------------------
    logout
  ---------------------------------------------------------------------------*/

  logout(e: any) {
    e.preventDefault();
    this.auth.logout();
    this.ts.enqueue([{key: 'success', value: 'Logged out.'}]);
    this.router.navigate(['/auth/login']);
  }

}
