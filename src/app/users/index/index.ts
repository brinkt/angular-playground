import { Component, OnInit } from '@angular/core';

import { AuthUser, AuthService } from '../../auth/auth.service';
import { ModelIndex } from '../../shared/model/index';

import { User } from '../user.interface';
import { UserService } from '../user.service';

@Component({
  templateUrl: './index.html'
})

export class UserIndexComponent extends ModelIndex implements OnInit {
  users: any;
  viewType = 'table';

  constructor(
    public auth: AuthService,
    private us: UserService
  ) {
    super(auth);
  }

  /*---------------------------------------------------------------------------
    ngOnInit:
  ---------------------------------------------------------------------------*/

  ngOnInit() {
    this.defaultView();
    this.getUsers();
  }

  /*---------------------------------------------------------------------------
    getUsers:
  ---------------------------------------------------------------------------*/

  getUsers(filters?: any) {
    this.us.index().subscribe(
      (data: User[]) => {
        this.auth.isAuth().subscribe((authUser: AuthUser) => {
          if (authUser.id) {
            const auth_id: string = authUser.id.toString();
            this.us.getFollows('following', auth_id, data).subscribe(
              users => {
                this.users = users;
              }
            );
          } else {
            this.users = data;
          }
        });
      },
      err => console.log(err)
    );
  }

  /*---------------------------------------------------------------------------
    processObject:

    UserTable & UserTile emit events to us for processing
  ---------------------------------------------------------------------------*/

  processObject(e: [any, string, any]) {
    if (e[0]) { e[0].preventDefault(); }

    if (e[1] === 'follow') {
      this.us.toggleFollow(1, e[2]);
    } else if (e[1] === 'unfollow') {
      this.us.toggleFollow(-1, e[2]);
    } else {
      console.log(e);
    }
  }

  /*-------------------------------------------------------------------------*/
}
