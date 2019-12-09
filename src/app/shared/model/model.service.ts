import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ModelService {
  objSingular: string;
  objPlural: string;

  constructor(
    public http: HttpClient ) {
  }

  /*---------------------------------------------------------------------------
    setupModel:

    defines {singular} and {plural} of object for correct routes
  ---------------------------------------------------------------------------*/

  setupModel(s: string, p: string) {
    this.objSingular = s;
    this.objPlural = p;
  }

  /*---------------------------------------------------------------------------
    hashToUrl:
  ---------------------------------------------------------------------------*/

  hashToUrl(obj: Object) {
    let r = '';
    for (const k of Object.keys(obj)) {
      if (r !== '') { r += '&'; }
      if ( typeof obj[k] === 'object' && obj[k].constructor === Array ) {
        let objk = '[';
        for ( const i of Object.keys(obj[k]) ) {
          objk += obj[k][i].toString() + ',';
        }
        objk = objk.replace(/,$/, ']');
        r += k + '=' + objk;
      } else {
        r += k + '=' + obj[k];
      }
    }
    return r ? '?' + r : '';
  }

  /*---------------------------------------------------------------------------
    index:

    can be scoped within parent
    ie, /bands/grateful-dead/shows
  ---------------------------------------------------------------------------*/

  index(op: { filters: any; scope: string } = { filters: {}, scope: '/' }) {
    return this.http.get(op.scope + this.objPlural + '.json' +
      this.hashToUrl(op.filters));
  }

  /*---------------------------------------------------------------------------
    find:
  ---------------------------------------------------------------------------*/

  find(id: string, params?: Object) {
    if (!params) { params = {}; }

    const prefix = this.objSingular === '' ? '' : '/' + this.objSingular;
    return this.http.get(prefix + '/' + id + '.json' + this.hashToUrl(params));
  }

  /*---------------------------------------------------------------------------
    scopeWithinPlural:

    scopes form object within {plural} before passing to backend
    { username: 'admin' } => { users: { username: 'admin' } }
  ---------------------------------------------------------------------------*/

  scopeWithinPlural(obj: Object): Object {
    if (obj[this.objPlural]) {
      return obj;
    } else {
      return {}[this.objPlural] = obj;
    }
  }

  /*---------------------------------------------------------------------------
    save:
    {create} or {update} action depending on presence of id
  ---------------------------------------------------------------------------*/

  save(obj: any) {
    // TODO: save to localStorage & marked not synced, attempt to save remote
    // if success, marked synced, else keep not synched flag
    return this.http.post('/' + this.objSingular + '.json',
      JSON.stringify(this.scopeWithinPlural(obj)));
  }

  /*---------------------------------------------------------------------------
    delete:
  ---------------------------------------------------------------------------*/

  delete(id: string) {
    return this.http.delete('/' + this.objSingular + '/' + id + '.json');
  }

  /*---------------------------------------------------------------------------
    thumbs:

    thumbs up/down scoped to singular object
  ---------------------------------------------------------------------------*/

  thumbs(id: string, vote: number) {
    return this.http.post('/' + this.objSingular + '/' + id + '/thumbs.json',
      JSON.stringify({thumbs: vote})
    );
  }

  /*-------------------------------------------------------------------------*/
}
