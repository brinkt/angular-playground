import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-page-tile',
  templateUrl: './tile.html'
})

export class PageTileComponent {
  @Input() page: any;
  @Output() pageEvent: EventEmitter<any> = new EventEmitter();

  constructor() {}

}
