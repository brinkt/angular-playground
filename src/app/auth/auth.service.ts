import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { Jwt, jwtValid } from './jwt';

export interface AuthUser {
  id?: string;
  username?: string;
  email?: string;
  exp?: string;
}

@Injectable()
export class AuthService {

  private jwt: Jwt = new Jwt();
  private tokenKey = 'id_token';

  isAuthPersist: Subject<AuthUser> = new Subject();

  constructor(
    private http: HttpClient) {}

  /*---------------------------------------------------------------------------
    pull JWT from localStorage
  ---------------------------------------------------------------------------*/

  getToken(): string {
    return localStorage.getItem(this.tokenKey);
  }

  /*---------------------------------------------------------------------------
    determine if authenticated by decoding to user object
  ---------------------------------------------------------------------------*/

  isAuth(newToken?: string): Observable<AuthUser> {
    const token: string = newToken || this.getToken();
    const authenticated: boolean = (token && jwtValid(token)) ? true : false;

    if (authenticated && newToken) {
      localStorage.setItem(this.tokenKey, token);
    }

    if (authenticated) {
      const user: AuthUser = this.jwt.decode(token);
      this.isAuthPersist.next(user);
      return Observable.of(user);

    } else {
      this.logout();
      return Observable.of({});
    }
  }

  /*---------------------------------------------------------------------------
    logout AKA removeToken from localStorage
  ---------------------------------------------------------------------------*/

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.isAuthPersist.next({});
  }

  /*---------------------------------------------------------------------------
    process login request by presence & validation of of {auth_token}
  ---------------------------------------------------------------------------*/

  processLogin(data: any): Observable<AuthUser> {
    if (data.auth_token) { return this.isAuth(data.auth_token); }
    return Observable.of({});
  }

  /*-------------------------------------------------------------------------*/
}
