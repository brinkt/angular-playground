import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ToastService } from '../toast/toast.service';
import { ModelService } from '../shared/model/model.service';

@Injectable()
export class PageService extends ModelService {

  constructor(
    public http: HttpClient,
    public ts: ToastService) {
    super(http);
    this.setupModel('page', 'pages');
  }

  /*-------------------------------------------------------------------------*/
}
