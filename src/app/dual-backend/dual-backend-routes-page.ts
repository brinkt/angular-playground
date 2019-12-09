import { HttpRequest } from '@angular/common/http';
import { LocalStorageDatabase } from './localstorage-database';
import { DualBackendRoute } from './dual-backend.interceptor';

export class DualBackendRoutesPage extends DualBackendRoute {
  params: Object;
  authObj: Object;

  constructor(
    public db: LocalStorageDatabase) {
    super(db);
  }

  /*---------------------------------------------------------------------------
    page routes
  ---------------------------------------------------------------------------*/

  process(req: HttpRequest<any>, options: Object, authObj?: Object): Object {
    if ( options['params'] ) { this.params = options['params']; }
    if ( authObj ) { this.authObj = authObj; }

    const r: string = options['path'];
    if (r === 'GET /pages') { return this.getPages();
    } else if (r.match(this.singlularObjectRegExp('page'))) {
      const [id, path]: [string, string] = this.IdFromParams(r, 'page');

      const page = this.db.findByKey('pages', 'path', id);
      if (page) {
        if (r.match(/^GET /)) {
          return page;
        } else {
          // delete
          this.db.saveRecord('pages', page, true);
          return { success: true, message: 'Page successfully deleted.' };
        }
      } else {
        return { error: '404', message: 'Page not found.' };
      }
    } else if (r === 'POST /page') { return this.update();
    }
  }

  /*-------------------------------------------------------------------------*/

  getPages() {
    const conditions: Object[] = [];
    if (this.params) {
      for ( const k of Object.keys(this.params) ){
        conditions.push({ op: 'eq', key: k, value: this.params[k] });
      }
    }
    return this.db.findAll('pages', conditions);
  }

  /*---------------------------------------------------------------------------
    update page
  ---------------------------------------------------------------------------*/

  update() {
    let page = this.db.findByKey('pages', 'id', this.params['id'], true);
    let newPage = false;

    if (!page) { page = {}; newPage = true; }

    page.title = this.params['title'];
    page.path = this.params['path'] || '';
    page.data = this.params['data'];

    this.db.saveRecord('pages', page);
    return { success: true, newPage: newPage };
  }

  /*-------------------------------------------------------------------------*/
}
