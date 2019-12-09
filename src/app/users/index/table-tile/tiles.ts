import { Component, Input, Output, EventEmitter } from '@angular/core';

import { ModelTiles } from '../../../shared/model/tiles';

@Component({
  selector: 'app-user-tiles',
  templateUrl: './tiles.html'
})

export class UserTilesComponent extends ModelTiles {
  @Input() users: any;
  @Output() userEvent: EventEmitter<any> = new EventEmitter();

  constructor() {
    super();
    this.watch = 'users';
  }

}
