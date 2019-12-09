import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-page-table',
  templateUrl: './table.html'
})

export class PageTableComponent {
  @Input() pages: any;
  @Output() pageEvent: EventEmitter<any> = new EventEmitter();

  constructor() {}

}
