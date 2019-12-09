import { HttpRequest } from '@angular/common/http';
import { keysFromHash, LocalStorageDatabase } from './localstorage-database';
import { DualBackendRoute } from './dual-backend.interceptor';

export class DualBackendRoutesUser extends DualBackendRoute {
  params: Object;
  authObj: Object;

  constructor(
    public db: LocalStorageDatabase) {
    super(db);
  }

  /*---------------------------------------------------------------------------
    user routes
  ---------------------------------------------------------------------------*/

  process(req: HttpRequest<any>, options: Object, authObj?: Object): Object {
    if ( options['params'] ) { this.params = options['params']; }
    if ( authObj ) { this.authObj = authObj; }

    const r: string = options['path'];
    if (r === 'GET /users') { return this.getUsers();
    } else if (r.match(this.singlularObjectRegExp('user'))) {
      const [id, path]: [string, string] = this.IdFromParams(r, 'user');

      if (path === '') { return this.db.findByKey('users', 'username', id);
      } else if (path === '/followers') { return this.getFollowers(id);
      } else if (path === '/following') { return this.getFollowing(id);
      } else if (path === '/follow') { return this.followUser(id);
      } else if (path === '/unfollow') { return this.unfollowUser(id);
      }
    }
  }

  /*-------------------------------------------------------------------------*/

  getUsers() {
    const conditions: Object[] = [];
    if (this.params) {
      for ( const k of Object.keys(this.params) ){
        conditions.push({ op: 'eq', key: k, value: this.params[k] });
      }
    }
    return this.db.findAll('users', conditions);
  }

  /*---------------------------------------------------------------------------
    returns array of follower_ids
  ---------------------------------------------------------------------------*/

  getFollowers(user_id: string) {
    const has_ids: boolean = this.params &&
      this.params.constructor === Array && this.params['length'] > 0;

    const conditions: Object[] = [{ op: 'eq', key: 'user_id',
      value: parseInt(user_id, 10) }];
    if ( has_ids ) { conditions.push({ op: 'eq', key: 'follower_id',
      value: this.params }); }

    const keys: any[] = keysFromHash('follower_id',
      this.db.findAll('users_followers', conditions));

    if ( !has_ids ) {
      // did not provide user_ids, so resolve to users
      return this.db.findAll('users', [{ op: 'eq', key: 'id', value: keys }]);
    } else {
      return keys;
    }
  }

  /*---------------------------------------------------------------------------
    returns array of user_ids
  ---------------------------------------------------------------------------*/

  getFollowing(user_id: string) {
    const has_ids: boolean = this.params &&
      this.params.constructor === Array && this.params['length'] > 0;

    const conditions: Object[] = [{ op: 'eq', key: 'follower_id',
      value: parseInt(user_id, 10) }];
    if ( has_ids ) { conditions.push({ op: 'eq', key: 'user_id',
      value: this.params }); }

    const keys: any[] = keysFromHash('user_id',
      this.db.findAll('users_followers', conditions));

    if ( !has_ids ) {
      // did not provide user_ids, so resolve to users
      return this.db.findAll('users', [{ op: 'eq', key: 'id', value: keys }]);
    } else {
      return keys;
    }
  }

  /*-------------------------------------------------------------------------*/

  followUser(user_id: string) {
    if (this.authObj && this.authObj['id'] && user_id !== '') {
      this.db.saveRecord('users_followers', {
        user_id: parseInt(user_id, 10), follower_id: this.authObj['id']
      });
      return { success: true };
    } else {
      return { error: 'Could not follower user' };
    }
  }

  /*-------------------------------------------------------------------------*/

  unfollowUser(user_id: string) {
    let f: any[];
    if (this.authObj && this.authObj['id'] && parseInt(user_id, 10)) {
      f = this.db.findAll('users_followers', [
        { op: 'eq', key: 'user_id', value: parseInt(user_id, 10) },
        { op: 'eq', key: 'follower_id', value: this.authObj['id'] }
      ]);
    }
    if (f.length > 0) {
      this.db.saveRecord('users_followers', f[0], true);
      return { success: true };
    } else {
      return { error: 'Could not unfollower user' };
    }
  }

  /*-------------------------------------------------------------------------*/
}
