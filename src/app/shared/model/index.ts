import { RouteHelper } from '../route-helper';
import { AuthUser, AuthService } from '../../auth/auth.service';

export class ModelIndex {
  routeHelper: RouteHelper = new RouteHelper();
  viewType = 'table';

  overlay = 'index';
  authenticated = false;

  indexPath: string;

  constructor(public auth: AuthService) {
    auth.isAuth().toPromise().then((authUser: AuthUser) => {
      this.authenticated = (authUser.username) ? true : false;
    });
  }

  /*---------------------------------------------------------------------------
    scrollListener:

    detect when scroll position nears bottom of page so
    more data can be loaded in on demand
  ---------------------------------------------------------------------------*/

  scrollListener: any = (e) => {
    const total: any = document.documentElement.scrollHeight;
    const visible: any = window.innerHeight;
    const scrollPos: any = window.scrollY;

    const scrollRem: any = parseInt(total, 10) - (parseInt(visible, 10) +
      parseInt(scrollPos, 10));
    console.log(scrollRem);
  }

  /*---------------------------------------------------------------------------
    default to {tile} on mobile and {table} on desktop
  ---------------------------------------------------------------------------*/

  defaultView() {
    if (this.viewType !== 'map') {
      this.viewType = window.innerWidth < 768 ? 'tile' : 'table';
    }

    const params: {path: string; params: { view: string }} =
      this.routeHelper.paramsFromUrl();

    if (params.params.view) { this.viewType = params.params.view; }
  }

  /*-------------------------------------------------------------------------*/
}
