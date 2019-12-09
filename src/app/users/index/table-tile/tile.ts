import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-user-tile',
  templateUrl: './tile.html'
})

export class UserTileComponent {
  @Input() user: any;
  @Output() userEvent: EventEmitter<any> = new EventEmitter();

  constructor() {}

}
