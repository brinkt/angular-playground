import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Page } from '../page.interface';
import { PageService } from '../page.service';

@Component({
  selector: 'app-page-form',
  templateUrl: './form.html'
})

export class PageFormComponent implements OnInit {
  @Input() page: Page;
  @Output() pageEvent: EventEmitter<any> = new EventEmitter();

  @Input() overlay: string;

  pageJSON = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private pageService: PageService
  ) {}

  /*---------------------------------------------------------------------------
    ngOnInit:
  ---------------------------------------------------------------------------*/

  ngOnInit() {
    if (!this.page.id && this.overlay === 'edit') {
      this.route.params.forEach((params: Params) => {
        this.getPage(params['id'] || '');
      });
    } else if (this.overlay === 'new') {
      this.page = { data: { layout: '1', data: [] }};
    }
  }

  /*---------------------------------------------------------------------------
    getPage:
  ---------------------------------------------------------------------------*/

  getPage(id: string) {
    this.pageService.find(id).subscribe(
      (page: Page) => {
        this.page = page;
      },
      err => console.log(err)
    );
  }

  /*-------------------------------------------------------------------------*/

  pageToJSON() {
    return JSON.stringify(this.page);
  }

  /*-------------------------------------------------------------------------*/

  onSubmit() {
    this.pageService.save(this.page).subscribe(
      (data: { success: string }) => {
        if (data.success) {
          this.pageService.ts.toast([{key: 'success', value: 'Changes saved.'}]);
          if (data['newPage']) {
            this.pageEvent.emit(['add', this.page]);
          } else {
            if (this.overlay) {
              this.pageEvent.emit(['index', {}]);
            } else {
              this.pageEvent.emit(['show', this.page]);
            }
          }
        }
      }
    );
  }

  /*-------------------------------------------------------------------------*/

  cancel(): void {
    if (this.overlay) {
      this.pageEvent.emit(['index', {}]);
    } else {
      this.pageEvent.emit(['show', this.page]);
    }
  }

  /*-------------------------------------------------------------------------*/
}
