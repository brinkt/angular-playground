import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  templateUrl: './debug.component.html',
})
export class DebugComponent {
  obj: any = {};
  jwtHead: Object;
  jwtObj: Object;
  jwtHash: string;
  keys: string[];

  constructor(private auth: AuthService) {
    this.loadLocalStorage();
  }

  loadLocalStorage() {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      const t = localStorage.getItem(k);
      if (k === 'id_token') {
        const temp = t.split('.');
        this.jwtHead = window.atob(temp[0]);
        this.jwtObj = window.atob(temp[1]);
        this.jwtHash = temp[2];
      } else {
        this.obj[k] = t;
      }
    }
    this.keys = Object.keys(this.obj);
  }

  resetLocalStorage() {
    if (confirm('Are you sure? Resetting removes all changes to data.')) {
      for (const k of Object.keys(this.keys)) {
        localStorage.removeItem(this.keys[k]);
      }
      this.auth.logout();
      window.location.href = '/';
    }
  }

}
