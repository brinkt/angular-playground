import { HttpClient, HttpParams } from '@angular/common/http';
import { suggestUser } from '../users/user.service';
import { randString } from './localstorage-database';
import { DualBackendGenerator } from './dual-backend.interceptor';

export class DualBackendGeneratorUser extends DualBackendGenerator {

  constructor(
    private http: HttpClient ) {
    super();
  }

  /*-------------------------------------------------------------------------*/

  initializeDb(cb?: any) {
    if ( !localStorage.getItem('users') ) {
      this.fetchFirstLastNames((firstNames, lastNames) => {

        // generate users
        const userCount = 50;
        const users: Object[] = [];
        for ( let i = 1; i < userCount; i++ ) {
          const user: Object = { id: i };
          user['name'] = firstNames[Math.floor(Math.random() * 100)] + ' ' +
            lastNames[Math.floor(Math.random() * 100)];
          user['username'] = suggestUser(user['name']);
          user['email'] = user['username'] + '@localhost';
          user['password'] = randString(8);
          user['confirmed'] = true;
          users.push(user);
        }

        // generate users_followers
        const fLookup: string[] = [];
        const followers: Object[] = [];
        for ( let x = 0; x < userCount * 20; x++ ) {
          const user_id: number = Math.floor(Math.random() * userCount);
          const follower_id: number = Math.floor(Math.random() * userCount);
          const fLook: string = user_id.toString() + ',' + follower_id.toString();

          if ( !fLookup.includes(fLook) ) {
            followers.push({ id: x, user_id: user_id, follower_id: follower_id });
            fLookup.push(fLook);
          }
        }

        // save to localStorage
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('users_followers', JSON.stringify(followers));

        if (cb) { cb(); }
      });
    } else {
      if (cb) { cb(); }
    }
  }

  /*-------------------------------------------------------------------------*/

  fetchFirstLastNames(cb: any) {
    let firstNames: string[];
    let lastNames: string[];

    this.http.get('/assets/users/first-names.csv', {
      params: new HttpParams().set('dualbackend', 'skip'),
      responseType: 'text'
    }).subscribe(firsts => {
      firstNames = this.extractCSV(firsts);
      this.http.get('/assets/users/last-names.csv', {
        params: new HttpParams().set('dualbackend', 'skip'),
        responseType: 'text'
      }).subscribe(
        lasts => {
          lastNames = this.extractCSV(lasts);
          cb(firstNames, lastNames);
        }
      );
    });
  }

  /*-------------------------------------------------------------------------*/
}
