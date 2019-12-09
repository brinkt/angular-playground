import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast',
  template: `
    <div id="toastContainer" class="alert alert-{{ts.now.key}}" *ngIf="ts.now">
      {{ts.now.value}}
    </div>
  `
})

export class ToastComponent {

  constructor(
    private router: Router,
    public ts: ToastService
  ) {
    // toast on route changes
    this.router.events.subscribe((e) => {
      if (e.constructor === NavigationEnd ) {
        const t: any = this.gatherToasts(e['url']);
        if (t.length > 0) { this.ts.enqueue(t); }
        if (this.ts.toasts.length > 0) { this.ts.dequeue(); }
      }
    });
  }

  /*---------------------------------------------------------------------------
    gatherToasts:

    split toasts from URL params into array; in case of a hard redirect
  ---------------------------------------------------------------------------*/

  gatherToasts(url: string) {
    let result: any[] = [];
    const kinds: string[] = ['success', 'info', 'warning', 'danger'];
    kinds.forEach((element, index) => {
      const v: any = this.getParam(url, element);
      if (v) { result = result.concat([{key: element, value: v}]); }
    });
    return result;
  }

  /*---------------------------------------------------------------------------
    getParam
  ---------------------------------------------------------------------------*/

  getParam(url: string, key: string) {
    url = url.substr(url.indexOf('?') + 1);
    const params: string[] = url.split('&');
    for (let i = 0; i < params.length; i++) {
     const temp: string[] = params[i].split('=');
     if ( temp[0] === key ) { return temp[1].replace(/\+/g, ' '); }
    }
  }

  /*-------------------------------------------------------------------------*/
}
