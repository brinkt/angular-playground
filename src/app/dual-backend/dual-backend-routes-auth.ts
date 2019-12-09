import { HttpRequest } from '@angular/common/http';
import { randString, LocalStorageDatabase } from './localstorage-database';
import { DualBackendRoute } from './dual-backend.interceptor';

export class DualBackendRoutesAuth extends DualBackendRoute {
  params: Object;
  authObj: Object;

  constructor(
    public db: LocalStorageDatabase) {
    super(db);
  }

  /*---------------------------------------------------------------------------
    authentication routes
  ---------------------------------------------------------------------------*/

  process(req: HttpRequest<any>, options: Object, authObj?: Object): Object {
    if ( options['params'] ) { this.params = options['params']; }
    if ( authObj ) { this.authObj = authObj; }

    const r: string = options['path'];
    if (r === 'POST /auth/login') { return this.login();
    } else if (r === 'POST /auth/register') { return this.register();
    } else if (r === 'POST /auth/checkuser') { return this.checkuser();
    } else if (r === 'POST /auth/account') { return this.account();
    } else if (r === 'POST /auth/password') { return this.password();
    } else if (r === 'POST /auth/username') { return this.username();
    } else if (r === 'POST /auth/resend/password') { return this.resendPassword();
    } else if (r === 'POST /auth/resend/confirm') { return this.resendConfirm();
    } else if (r === 'POST /auth/resend/unlock') { return this.resendUnlock();
    } else if (r === 'POST /auth/token/email') { return this.confirmEmail();
    } else if (r === 'POST /auth/token/password') { return this.resetPassword();
    } else if (r === 'POST /auth/token/unlock') { return this.unlockAccount();
    }
  }

  /*---------------------------------------------------------------------------
    login
  ---------------------------------------------------------------------------*/

  login() {
    this.params['login'] = this.params['login'].toLowerCase();

    let user = this.db.findByKey('users', 'username', this.params['login'], true);
    if (!user) { user = this.db.findByKey('users', 'email', this.params['login'], true); }

    if (typeof user === 'object' && user['password'] === this.params['password']) {
      if (user['confirmed'] === true) {
        // create auth object
        const authObj = { id: user['id'], username: user['username'], email: user['email'],
          exp: (new Date()).getTime() };

        // mock Jwt (which is invalid)
        return { auth_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.' +
          window.btoa(JSON.stringify(authObj)) + '.invalid-hash' };
      } else {
        return { error: 401, message: 'Please confirm your email.' };
      }
    } else {
      return { error: 401, message: 'Invalid login or password.' };
    }
  }

  /*---------------------------------------------------------------------------
    registration
  ---------------------------------------------------------------------------*/

  register() {
    const user = this.db.findByKey('users', 'email', this.params['email']);

    if (typeof user === 'object') {
      return { error: 409, message: 'E-mail address already registered.' };
    } else {
      // remove columns
      delete this.params['email_confirm'];
      delete this.params['password_confirm'];
      // generate email confirmation token
      this.params['email_token'] = randString(32);

      this.db.saveRecord('users', this.params);
      return { success: 'Confirmation instructions sent to: ' + this.params['email'] };
    }
  }

  /*---------------------------------------------------------------------------
    checkuser
  ---------------------------------------------------------------------------*/

  checkuser() {
    return this.db.findByKey('users', 'username', this.params['username']) ?
      {valid: false} : {valid: true};
  }

  /*---------------------------------------------------------------------------
    change password
  ---------------------------------------------------------------------------*/

  password() {
    let foundbyToken = false;

    let user = this.db.findByKey('users', 'username', this.params['username'], true);
    if (!user && this.params['token']) {
      user = this.db.findByKey('users', 'password_token', this.params['token'], true);
      foundbyToken = true;
    }

    if (typeof user === 'object' && (foundbyToken === true ||
      user.password === this.params['current_password']) ) {
      if (this.params['new_password'] === this.params['password_confirm']) {
        user.password = this.params['new_password'];
        delete user.password_token;

        this.db.saveRecord('users', user);
        return { success: true };
      } else {
        return { error: 409, message: 'New passwords do not match.' };
      }
    } else {
      return { error: 401, message: 'Invalid username, token, or password.' };
    }
  }

  /*---------------------------------------------------------------------------
    change username
  ---------------------------------------------------------------------------*/

  username() {
    const user = this.db.findByKey('users', 'username', this.params['username'], true);

    if (typeof user === 'object') {
      user.username = this.params['new_username'];

      this.db.saveRecord('users', user);
      return { success: true };
    } else {
      return { error: 401, message: 'Could not change username.' };
    }
  }

  /*---------------------------------------------------------------------------
    update account
  ---------------------------------------------------------------------------*/

  account() {
    const user = this.db.findByKey('users', 'username', this.params['username'], true);

    if (typeof user === 'object') {
      user.name = this.params['name'];
      if ( this.params['email'] === this.params['email_confirm'] &&
          user.email !== this.params['email'] ) {
        // changing email
        user.email = this.params['email'];

        this.db.saveRecord('users', user);
        return { success: 'Email changed' };
      } else {
        this.db.saveRecord('users', user);
        return { success: true };
      }
    } else {
      return { error: 401, message: 'Could not update account.' };
    }
  }

  /*---------------------------------------------------------------------------
    resend instructions helper
  ---------------------------------------------------------------------------*/

  resendHelper(kind: string, response: Object) {
    const user = this.db.findByKey('users', 'email', this.params['email'], true);
    if (typeof user === 'object') {
      if ( kind === 'password' || ( kind === 'email' && !user['confirmed'] ) ||
         ( kind === 'unlock' && user['locked']) ) {

        user[kind + '_token'] = randString(32);
        this.db.saveRecord('users', user);
      }
    }
    return response;
  }

  // resend password reset instructions
  resendPassword() {
    return this.resendHelper('password',
      { success: 'Password reset instructions sent to: ' + this.params['email'],
        redirect: '/auth/token/password' });
  }

  // resend email confirmation instructions
  resendConfirm() {
    return this.resendHelper('email',
      { success: 'Confirmation instructions sent to: ' + this.params['email'],
        redirect: '/auth/token/email' });
  }

  // resend unlock instructions
  resendUnlock() {
    return this.resendHelper('unlock',
      { success: 'Unlock instructions sent to: ' + this.params['email'],
        redirect: '/auth/token/unlock' });
  }

  /*---------------------------------------------------------------------------
    confirm email address by token
  ---------------------------------------------------------------------------*/

  confirmEmail() {
    const user = this.db.findByKey('users', 'email_token', this.params['token'], true);

    if (typeof user === 'object') {
      user['confirmed'] = true;
      delete user['email_token'];

      this.db.saveRecord('users', user);
      return { success: 'Account has been confirmed.' };
    } else {
      return { error: 404, message: 'Token not found.' };
    }
  }

  /*---------------------------------------------------------------------------
    reset password by token
  ---------------------------------------------------------------------------*/

  resetPassword() {
    const user = this.db.findByKey('users', 'password_token', this.params['token'], true);

    if (typeof user === 'object') {
      return { redirect: '/auth/change/password' };
    } else {
      return { error: 404, message: 'Token not found.' };
    }
  }

  /*---------------------------------------------------------------------------
    unlock account by token
  ---------------------------------------------------------------------------*/

  unlockAccount() {
    const user = this.db.findByKey('users', 'unlock_token', this.params['token'], true);

    if (typeof user === 'object') {
      delete user['unlock_token'];

      this.db.saveRecord('users', user);
      return { success: 'Account has been unlocked.' };
    } else {
      return { error: 404, message: 'Token not found.' };
    }
  }

  /*-------------------------------------------------------------------------*/
}
