import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Page } from '../page.interface';
import { PageService } from '../page.service';

import { AuthUser, AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-page-show',
  templateUrl: './show.html'
})

export class PageShowComponent implements OnInit {
  @Input() page: Page = {};
  @Output() pageEvent: EventEmitter<any> = new EventEmitter();

  @Input() overlay: string;

  editMode = false;
  authenticated = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private pageService: PageService
  ) {}

  /*---------------------------------------------------------------------------
    ngOnInit:
  ---------------------------------------------------------------------------*/

  ngOnInit() {
    this.auth.isAuth().toPromise().then((authUser: AuthUser) => {
      this.authenticated = (authUser.username) ? true : false;
    });

    if (!this.page.id) {
      this.route.params.forEach((params: Params) => {
        this.getPage(params['id'] || '');
      });
    }
  }

  /*---------------------------------------------------------------------------
    getPage:
  ---------------------------------------------------------------------------*/

  getPage(id: string): void {
    this.pageService.find(id).subscribe(
      (page: Page) => {
        this.page = page;
      },
      err => console.log(err)
    );
  }

  /*---------------------------------------------------------------------------
    editPage:
  ---------------------------------------------------------------------------*/

  editPage() {
    if (this.overlay === 'show') {
      this.pageEvent.emit(['edit', this.page]);
    } else {
      this.editMode = true;
    }
  }

  /*---------------------------------------------------------------------------
    processObject:
  ---------------------------------------------------------------------------*/

  processObject(e: [string, Page]): void {
    if (e[0] === 'show') {
      this.editMode = false;
      this.page = e[1];
    }
  }

  /*-------------------------------------------------------------------------*/
}
