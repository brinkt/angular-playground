import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-user-table',
  templateUrl: './table.html'
})

export class UserTableComponent {
  @Input() users: any;
  @Output() userEvent: EventEmitter<any> = new EventEmitter();

  constructor() {}

}
