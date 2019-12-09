import { Component, AfterViewInit, ViewChild, Input, EventEmitter,
  Output, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ToastService } from '../../toast/toast.service';

@Component({
  selector: 'app-auth-username-form',
  templateUrl: './form.html'
})

export class AuthUsernameFormComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() username: any;
  @Output() usernameChange: EventEmitter<any> = new EventEmitter();

  @Input() parentForm: any;
  @ViewChild('usernameCtrl') usernameCtrl;

  checkuser = '';

  /*---------------------------------------------------------------------------
    form validation messages
  ---------------------------------------------------------------------------*/

  validationMessages = {
    'username': {
      'required': 'Username is required.',
      'minlength': 'Username must be at least 4 characters long.',
      'maxlength': 'Username cannot be more than 24 characters long.'
    }
  };

  /*---------------------------------------------------------------------------
    constructor
  ---------------------------------------------------------------------------*/

  constructor(
    private http: HttpClient,
    private ts: ToastService,
    private cdRef: ChangeDetectorRef ) {
  }

  /*---------------------------------------------------------------------------
    ngOnInit:

    add username control to parent form for validation
  ---------------------------------------------------------------------------*/

  ngOnInit() {
    if (this.usernameCtrl) {
      this.parentForm.form.addControl('username', this.usernameCtrl.control);
      this.cdRef.detectChanges();
    }
  }

  /*---------------------------------------------------------------------------
    ngAfterViewInit:

    subscribe to typed username input changes, format, emit back to parent
    username value will come back within {ngOnChanges} to perform actual
    checkuser request
  ---------------------------------------------------------------------------*/

  ngAfterViewInit() {
    this.usernameCtrl.valueChanges.debounceTime(1000).subscribe((val) => {
      if (val) { this.usernameChange.emit(this.formatUser(val)); }
    });
  }

  /*---------------------------------------------------------------------------
    ngOnChanges:

    detect & check username changes from parent; ie, suggesting based on {name}
  ---------------------------------------------------------------------------*/

  ngOnChanges(changes: SimpleChanges): void {
    const change = changes['username'].currentValue;
    if (change && change !== '' && change === this.formatUser(change)) {
      this.checkUser(this.username);
    }
  }

  /*---------------------------------------------------------------------------
    formatUser:

    strips all invalid characters from username
  ---------------------------------------------------------------------------*/

  formatUser(val: string): string {
    val = JSON.parse(JSON.stringify(val));
    return val.toLowerCase().replace(/^[^a-z]+/, '').replace(/[^\w\d\_]+/g, '');
  }

  /*---------------------------------------------------------------------------
    checkUser:

    make request to backend to check if username valid/available
  ---------------------------------------------------------------------------*/

  checkUser(val: string) {
    if (val === '' || this.checkuser === val) { return; }

    this.http.post('/auth/checkuser.json', JSON.stringify({username: val}), {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    }).toPromise().then(data => {
      if (data['valid'] === true) {
        this.checkuser = val;
        this.usernameCtrl.control.updateValueAndValidity();
      } else {
        this.usernameCtrl.control.setErrors({'equalTo': false});
        this.checkuser = '$';
      }
    }).catch(this.ts.doError);
  }

  /*-------------------------------------------------------------------------*/
}
