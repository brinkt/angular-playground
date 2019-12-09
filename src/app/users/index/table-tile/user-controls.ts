import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AuthUser, AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-user-table-tile-controls-component',
  templateUrl: './user-controls.html'
})

export class UserTableTileControlsComponent {
  @Input() user: any;
  @Output() userEvent: EventEmitter<any> = new EventEmitter();

  authenticated = false;
  authUser: AuthUser;

  constructor(
    public auth: AuthService
  ) {
    auth.isAuth().subscribe((au: AuthUser) => {
      this.authUser = (au.username) ? au : {};
      this.authenticated = (au.username) ? true : false;
    });
  }

}
