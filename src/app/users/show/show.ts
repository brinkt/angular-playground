import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { User } from '../user.interface';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-show',
  templateUrl: './show.html'
})

export class UserShowComponent implements OnInit {
  user: User = {};
  following: Object[] = [];
  followers: Object[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private us: UserService
  ) {}

  /*---------------------------------------------------------------------------
    ngOnInit:
  ---------------------------------------------------------------------------*/

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      if (params['username'] !== undefined) {
        this.getUser(params['username']);
      }
    });
  }

  /*---------------------------------------------------------------------------
    getUser:
  ---------------------------------------------------------------------------*/

  getUser(id: string) {
    this.us.find(id).subscribe(
      (data: User) => {
        this.user = data;
        this.getFollowersFollowing('following');
        this.getFollowersFollowing('followers');
      },
      err => console.log(err)
    );
  }

  /*---------------------------------------------------------------------------
    getFollowers:
  ---------------------------------------------------------------------------*/

  getFollowersFollowing(kind: string) {
    this.us.getFollows(kind, this.user.id.toString()).subscribe(
      users => {
        this[kind] = users;
      }
    );
  }

  /*-------------------------------------------------------------------------*/
}
