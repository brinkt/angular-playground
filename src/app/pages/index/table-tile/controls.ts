import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { AuthUser, AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-page-table-tile-controls-component',
  templateUrl: './controls.html'
})

export class PageTableTileControlsComponent implements OnInit {
  @Input() page: any;
  @Output() pageEvent: EventEmitter<any> = new EventEmitter();

  authenticated = false;

  constructor(
    private auth: AuthService) {}

  ngOnInit() {
    this.auth.isAuth().toPromise().then((authUser: AuthUser) => {
      this.authenticated = (authUser.username) ? true : false;
    });
  }

}
