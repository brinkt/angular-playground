import { Component, Input, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { ToastService } from '../../toast/toast.service';

interface AuthAccountFormResponse {
  success?: string;
}

@Component({
  selector: 'app-auth-account-form',
  templateUrl: './account-form.html'
})

export class AuthAccountFormComponent {
  @Input() user: any;
  @ViewChild('accountForm') accountForm;

  /*---------------------------------------------------------------------------
    form validation messages
  ---------------------------------------------------------------------------*/

  validationMessages = {
    'name': { 'required': 'Name is required.' },
    'email': {
      'required': 'Email is required.',
      'email': 'Email format is not valid.'
    },
    'email_confirm': { 'equalTo': 'Email confirmation must match.' }
  };

  /*-------------------------------------------------------------------------*/

  constructor(
    private http: HttpClient,
    private router: Router,
    private ts: ToastService ) {
  }

  /*-------------------------------------------------------------------------*/

  onSubmit() {
    this.http.post('/auth/account.json', JSON.stringify(this.user)).subscribe(
      (data: AuthAccountFormResponse) => {
        this.accountForm.form.markAsPristine();
        if ( data.success === 'Email changed') {
          this.ts.enqueue([{key: 'success',
            value: 'Account information updated. New e-mail requires confirmation'}]);
          this.router.navigate(['/auth/login']);
        } else {
          this.ts.enqueue([{key: 'success', value: 'Account information updated'}]);
          this.ts.dequeue();
        }
      },
      err => this.ts.doError(err)
    );
  }

  /*-------------------------------------------------------------------------*/
}
