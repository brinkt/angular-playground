import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { ModelIndex } from '../../shared/model/index';

import { Page } from '../page.interface';
import { PageService } from '../page.service';

import { AuthService } from '../../auth/auth.service';

@Component({
  templateUrl: './index.html'
})

export class PageIndexComponent extends ModelIndex implements OnInit {
  page: Page = {};
  pages: Array<Page>;
  viewType = 'table';

  constructor(
    public auth: AuthService,
    private location: Location,
    private ps: PageService
  ) {
    super(auth);
  }

  /*---------------------------------------------------------------------------
    ngOnInit:
  ---------------------------------------------------------------------------*/

  ngOnInit() {
    this.defaultView();
    this.getPages();
  }

  /*---------------------------------------------------------------------------
    getPages:
  ---------------------------------------------------------------------------*/

  getPages(filters?: any) {
    this.ps.index().subscribe(
      (pages: Array<Page>) => {
        this.pages = pages;
      },
      err => console.log(err)
    );
  }

  /*---------------------------------------------------------------------------
    processObject:

    Table & Tile emit events to us for processing
  ---------------------------------------------------------------------------*/

  processObject(e: [string, Page]): void {
    if (['show', 'edit'].includes(e[0])) {
      this.page = e[1];
      this.overlay = e[0];
      this.indexPath = this.location.path(true);
      this.location.go('/' + this.page.path);

    } else if (e[0] === 'index') {
      this.page = {};
      this.overlay = e[0];
      if (this.indexPath) { this.location.go(this.indexPath); }

    } else if (e[0] === 'new') {
      this.page = {};
      this.overlay = e[0];

    } else if (e[0] === 'delete') {
      if (confirm('Are you sure you want to delete this page?')) {
        this.ps.delete(e[1].path).subscribe(data => {
          this.pages.splice(this.pages.indexOf(e[1]), 1);
        });
      }

    } else if (e[0] === 'add') {
      this.pages.push(e[1]);
      this.page = {};
      this.overlay = 'index';

    } else {
      console.log('Unknown event: ' + e[0]);
      console.log(e);
    }
  }

  /*-------------------------------------------------------------------------*/
}
