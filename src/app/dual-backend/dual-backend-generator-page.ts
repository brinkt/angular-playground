import { HttpClient, HttpParams } from '@angular/common/http';
import { DualBackendGenerator } from './dual-backend.interceptor';

export class DualBackendGeneratorPage extends DualBackendGenerator {
  pages: Object[] = [];
  knownPages = [ 'home' ];
  idIncrement = 1;

  constructor(
    private http: HttpClient ) {
    super();
  }

  /*-------------------------------------------------------------------------*/

  initializeDb(cb?: any) {
    if ( !localStorage.getItem('pages') ) {
      this.iteratePages(() => {
        // save to localStorage
        localStorage.setItem('pages', JSON.stringify(this.pages));

        if (cb) { cb(); }
      });
    } else {
      if (cb) { cb(); }
    }
  }

  /*-------------------------------------------------------------------------*/

  iteratePages(cb: any) {
    const page = this.knownPages.pop();
    this.getPage(page, cb);
  }

  /*-------------------------------------------------------------------------*/

  getPage(name: string, cb: any) {
    this.http.get('/assets/pages/' + name + '.json', {
      params: new HttpParams().set('dualbackend', 'skip')
    }).subscribe(
      data => {
        data['id'] = this.idIncrement;
        this.idIncrement++;

        this.pages.push(data);

        if (this.knownPages.length > 0) {
          this.iteratePages(cb);
        } else {
          cb();
        }
      }
    );
  }

  /*-------------------------------------------------------------------------*/
}
