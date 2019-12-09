import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouteHelper } from '../route-helper';

@Component({
  selector: 'app-shared-view-types',
  templateUrl: './view-types.html'
})

export class SharedViewTypesComponent {
  @Input() includeMap: boolean;
  @Input() viewType: string;
  @Output() viewTypeChange: any = new EventEmitter();

  routeHelper: RouteHelper = new RouteHelper();

  setType(name: string) {
    this.viewType = name;
    this.viewTypeChange.emit(this.viewType);
    this.routeHelper.updatePushState({
      params: [{ key: 'view', value: this.viewType }]
    });
  }

}
