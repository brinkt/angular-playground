import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/delay';
import 'rxjs/add/observable/from';

@Injectable()
export class ToastService {
  toasts: any[] = [];
  now: any;

  constructor() {}

  /*---------------------------------------------------------------------------
    toast
  ---------------------------------------------------------------------------*/

  toast(more: any[]) {
    this.enqueue(more);
    this.dequeue();
  }

  /*---------------------------------------------------------------------------
    enqueue
  ---------------------------------------------------------------------------*/

  enqueue(more: any[]) {
    this.toasts = this.toasts.concat(more);
  }

  /*---------------------------------------------------------------------------
    dequeue
  ---------------------------------------------------------------------------*/

  dequeue() {
    if (this.toasts.length > 0) {
      this.now = this.toasts.shift();
      const temp = Object.assign([], this.toasts);
      this.toasts = [];
      Observable.from(temp.concat([null])).delay(5000).subscribe(t => {
        if (t) {
          this.now = t;
        } else {
          delete this.now;
        }
      });
    }
  }

  /*---------------------------------------------------------------------------
    doError
  ---------------------------------------------------------------------------*/

  doError(err: any) {
    let result: any[] = [];

    if (err.constructor === String) {
      const errs = JSON.parse(err);

      if (errs.constructor === Array) {
        errs.forEach((element, index) => {
          result = result.concat([{ key: 'danger', value: element }]);
        });
      } else if (errs.constructor === Object) {
        for (const key of Object.keys(errs)) {
          result = result.concat([{ key: 'danger',
            value: key + ': ' + err[key] }]);
        }
      }
    } else if (err.constructor === Error || err.constructor === Object) {
      result = result.concat([{key: 'danger', value: err.message}]);
    }

    if (result.length > 0) { this.toast(result); }
  }

  /*-------------------------------------------------------------------------*/
}
