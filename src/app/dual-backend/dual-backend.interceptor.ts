import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpEvent, HttpInterceptor, HttpResponse,
  HttpHandler, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { LocalStorageDatabase } from './localstorage-database';

import { RouteHelper } from '../shared/route-helper';

/*-----------------------------------------------------------------------------
  DualBackendRoute:

  extend this for route handling
-----------------------------------------------------------------------------*/

export class DualBackendRoute {

  constructor(public db: LocalStorageDatabase) {}

  singlularObjectRegExp(objType: string) {
    return RegExp('^[A-Z]+ \/' + objType + '\/[0-9a-z-_]*');
  }

  IdFromParams(path: string, objType: string): [string, string] {
    let obj: string = path.match(
      RegExp('\/' + objType + '\/[0-9a-z-_]*')
    )[0].replace(RegExp('^\/' + objType), '').replace(/^\//, '');

    if (obj.match(/\//)) { obj = obj.split('/')[0]; }
    path = path.replace(RegExp('.+\/' + objType + '\/'), '').replace(obj, '');

    return [obj, path];
  }

}

/*-----------------------------------------------------------------------------
  DualBackendConfig:
-----------------------------------------------------------------------------*/

export interface DualBackendConfigArgs {
  routes?: any[];
  generators?: any[];
}

export class DualBackendConfig implements DualBackendConfigArgs {
  routes: any[];
  generators: any[];

  constructor(config: DualBackendConfigArgs = {}) {
    Object.assign(this, {
      routes: [],
      generators: []
    }, config);
  }
}

/*-----------------------------------------------------------------------------
  DualBackendGenerator:

  extend this for fixture generation
-----------------------------------------------------------------------------*/

export class DualBackendGenerator {

  constructor() {}

  extractCSV(data: string): string[] {
    const linesData = data.split(/\r\n|\n/);
    const headers = linesData[0].split(',');
    const lines = [];
    for ( let i = 1; i < linesData.length; i++ ) {
      const lineData = linesData[i].split(',');
      if ( lineData[1] ) {
        lines.push(lineData[1].replace(/['"]+/g, ''));
      }
    }
    return lines;
  }

}

/*-----------------------------------------------------------------------------
  DualBackendInterceptor:
-----------------------------------------------------------------------------*/

@Injectable()
export class DualBackendInterceptor implements HttpInterceptor {
  private firstRun = true;
  private routes: any[] = [];
  private routeHelper: RouteHelper = new RouteHelper();

  constructor(
    private injector: Injector,
    private config: DualBackendConfig,
    private localDb: LocalStorageDatabase) {}

  /*---------------------------------------------------------------------------
    Intercept an outgoing `HttpRequest`
  ---------------------------------------------------------------------------*/

  intercept(req: HttpRequest<any>,
    next: HttpHandler): Observable<HttpEvent<any>> {

    if (this.firstRun && !req.params.has('dualbackend')) { this.setup(); }

    const clone: HttpRequest<any> = req.clone();

    return this.process(clone, next);
  }

  /*-------------------------------------------------------------------------*/

  setup(): void {
    // inject HttpClient (avoid recursive error)
    const http = this.injector.get(HttpClient);

    // build routes from config
    for ( const r in this.config.routes ) {
      if ( this.config.routes[r].prototype instanceof DualBackendRoute ) {
        this.routes.push(new this.config.routes[r](this.localDb));
      }
    }

    // generate initial fixture data
    for ( const g in this.config.generators ) {
      if ( this.config.generators[g].prototype instanceof DualBackendGenerator ) {
        // create initial database
        (new this.config.generators[g](http)).initializeDb(() => {
          // finish initialization if this is last generator
          if (parseInt(g, 10) >= this.config.generators.length - 1) {
            this.localDb.initFinish();
            this.firstRun = false;
          }
        });
      }
    }
  }

  /*-------------------------------------------------------------------------*/

  protected process(req: HttpRequest<any>,
    next: HttpHandler): Observable<HttpEvent<any>> {

    const options: {path: string; params: any} = this.requestFromUrl(req);

    // pull params from body
    if (req.body && req.body.length > 0) {
      options.params = JSON.parse(req.body);
    }

    // authorization
    let authObj: Object;
    if ( req.headers.has('authorization') ) {
      let objStr: string = req.headers.get('authorization');
      if ( objStr.split('.').length === 3) {
        objStr = objStr.split('.')[1];
        try {
          authObj = JSON.parse(window.atob(objStr));
        } catch (err) {
          console.log('Error decoding authorization object!');
        }
      }
    }

    // debug
    console.log('Backend Intercept: ' + options.path);
    // if( options.params ){ console.log(options.params); }

    // routes
    let rObj: Object;
    for ( const r of Object.keys(this.routes) ) {
      if (!rObj) {
        rObj = this.routes[r].process(req, options, authObj);
      } else {
        break;
      }
    }

    // if rObj is a subscriber, then route exists, but backend is not yet initialized
    // console.log(rObj);

    if (rObj) {
      return this.obsResponse(req, {
        body: rObj,
        headers: new Headers({ 'Content-Type': 'application/json' }),
        status: 200
      });
    } else {
      return next.handle(req);
    }
  }

  /*-------------------------------------------------------------------------*/

  protected obsResponse(req: HttpRequest<any>,
    resOpt: Object): Observable<HttpEvent<any>> {

    const res = new HttpResponse(resOpt);

    return new Observable<HttpResponse<any>>(
      (obs: Observer<HttpResponse<any>>) => {
      if ( res.status >= 200 && res.status < 300 ) {
        obs.next(res);
        obs.complete();
      } else {
        obs.error(res);
      }
      return () => {}; // unsubscribe
    });
  }

  /*---------------------------------------------------------------------------
    strips request from URL
  ---------------------------------------------------------------------------*/

  requestFromUrl(req: HttpRequest<any>): {path: string; params: any} {
    const rh: {path: string; params: any} =
      this.routeHelper.paramsFromUrl(this.urlShorten(req.url));
    return { path: req.method + ' ' + rh.path, params: rh.params };
  }

  /*---------------------------------------------------------------------------
    shorterns URL full path. ie, http://localhost:4200/users => /users
  ---------------------------------------------------------------------------*/

  urlShorten(url: string) {
    if (url.match(/^[a-z]+:\/\//)) {
      // remove prefix http://
      url = url.replace(/^[a-z]+:\/\//, '');
      // skip to next forward-slash
      url = url.replace(/^\S+\//, '/');
    }
    return url;
  }

  /*-------------------------------------------------------------------------*/
}
