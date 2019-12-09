import { Component, Input, Output, EventEmitter } from '@angular/core';

import { ModelTiles } from '../../../shared/model/tiles';

@Component({
  selector: 'app-page-tiles',
  templateUrl: './tiles.html'
})

export class PageTilesComponent extends ModelTiles {
  @Input() pages: any;
  @Output() pageEvent: EventEmitter<any> = new EventEmitter();

  constructor() {
    super();
    this.watch = 'pages';
  }

}
