import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ToastService } from '../toast/toast.service';
import { ModelService } from '../shared/model/model.service';

import { User } from './user.interface';

import { keysFromHash } from '../dual-backend/localstorage-database';

/*-----------------------------------------------------------------------------
  suggestUser:

  suggest username based on inputs to {name} & 3 random digits
-----------------------------------------------------------------------------*/

export function suggestUser(name: any) {
  name = JSON.parse(JSON.stringify(name.toLowerCase()));
  const names: any = name.split(/\s+/);

  name = '';
  for ( const x of Object.keys(names) ) {
    if ( parseInt(x, 10) === 0 ) {
      name += names[x];
    } else if ( parseInt(x, 10) > 0) {
      name += names[x][0];
    }
  }
  name += (Math.floor(Math.random() * 900) + 100).toString();
  return name;
}

/*-----------------------------------------------------------------------------
  UserService:
-----------------------------------------------------------------------------*/

@Injectable()
export class UserService extends ModelService {

  constructor(
    public http: HttpClient,
    public ts: ToastService) {
    super(http);
    this.setupModel('user', 'users');
  }

  /*---------------------------------------------------------------------------
    getFollows:

    handle user following/followers
  ---------------------------------------------------------------------------*/

  getFollows(kind: string, user_id: string, users?: Object[]) {
    return Observable.create((obs) => {
      this.http.post('/user/' + user_id + '/' + kind + '.json',
        JSON.stringify(keysFromHash('id', users))
      ).subscribe(
        (data: User[]) => {
          if (users) {
            // update existing users object by matching id
            for ( const i of Object.keys(users) ) {
              if ( data.includes(users[i]['id'])) {
                users[i]['followed'] = true;
              }
            }
            obs.next(users);
          } else {
            obs.next(data);
          }
          obs.complete();
        },
        err => {
          obs.next(users || []); obs.complete();
        }
      );
    });
  }

  /*---------------------------------------------------------------------------
    toggleFollow:
  ---------------------------------------------------------------------------*/

  toggleFollow(toggle: number, user: any) {
    if (toggle > 0) {
      this.http.post('/user/' + user.id.toString() + '/follow.json',
        JSON.stringify({ user_id: user.id })
      ).subscribe(
        data => user['followed'] = true,
        err => this.ts.doError(err)
      );
    } else {
      this.http.delete('/user/' + user.id.toString() + '/unfollow.json',
        JSON.stringify({ user_id: user.id })
      ).subscribe(
        data => user['followed'] = false,
        err => this.ts.doError(err)
      );
    }
  }

  /*-------------------------------------------------------------------------*/
}
