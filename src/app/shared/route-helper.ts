
export class RouteHelper {
  constructor() {}

  /*---------------------------------------------------------------------------
    updatePushState:
  ---------------------------------------------------------------------------*/

  updatePushState(options: {params: any}) {
    const loc: Object = window.location.href.toString().split(
      window.location.host
    );
    const pObj: {path: string; params: any} = this.paramsFromUrl(loc[1]);

    // update params
    if ( options.params.constructor === Array ) {
      for ( const p of Object.keys(options.params) ){
        if ( typeof options.params[p] === 'object' ) {
          const key: string = options.params[p]['key'];
          const val: string = options.params[p]['value'];
          if ( key.length > 0 ) {
            pObj.params[key] = val;
          }
        }
      }
    }

    // rebuild location
    const newLocation = loc[0] + window.location.host + pObj['path'] + '?' +
      this.paramsToUrl(pObj['params']);

    // apply to pushState
    history.pushState(null, null, newLocation);
  }

  /*---------------------------------------------------------------------------
    paramsToUrl:
  ---------------------------------------------------------------------------*/

  paramsToUrl(params: Object) {
    let r = '';
    const keys: string[] = Object.keys(params);
    for ( const k of Object.keys(keys) ) {
      r += keys[k] + '=' + params[keys[k]] + '&';
    }
    return r.slice(0, -1);
  }

  /*---------------------------------------------------------------------------
    paramsFromUrl:

    breaks {path} && {params} out of URL

    ie, /token/password?token=abcdf124589ghklmnop09865
    { path: '/token/password', params: { token: 'abcdf124589ghklmnop09865' } }

    ie, /users?id=[1,3,4]
    { path: '/users', params: { id: [1,2,3] } }
    ids are translated to integers from strings
  ---------------------------------------------------------------------------*/

  paramsFromUrl(urlStr?: string): {path: string; params: any} {
    const result = { path: '', params: {} };

    if (!urlStr) {
      urlStr = window.location.href.toString().split(window.location.host)[1];
    }
    const urlSplit = urlStr.split('?');
    // remove: ie, .json
    result['path'] = urlSplit[0].replace(/\..*/, '');

    if (urlSplit[1]) {
      const params = urlSplit[1].split('&');
      for (const i of Object.keys(params)) {
        const x = params[i].split('=');
        result['params'][x[0]] = this.arrayFromString(x[1]) || x[1];
      }
    }

    return result;
  }

  /*---------------------------------------------------------------------------
    arrayFromString:

    support [1,2,3] as array of ids
  ---------------------------------------------------------------------------*/

  arrayFromString(str: string) {
    if ( str.match(/^\[.*\]$/) ) {
      str = str.replace(/^\[/, '').replace(/\]$/, '');
      return str.split(',').map((x) => {
        return (parseInt(x, 10).toString() === x) ? parseInt(x, 10) : x;
      });
    }
  }

  /*-------------------------------------------------------------------------*/
}
