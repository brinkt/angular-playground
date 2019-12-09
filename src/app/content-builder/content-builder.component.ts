import { Component, Input, Output, EventEmitter } from '@angular/core';

import { SharedContentBuilder } from './content-builder';

import { ToastService } from '../toast/toast.service';
import { DragulaService } from 'ng2-dragula/ng2-dragula';

@Component({
  selector: 'app-content-builder',
  templateUrl: './content-builder.component.html',
  styleUrls: [ './content-builder.component.scss' ]
})

export class ContentBuilderComponent extends SharedContentBuilder {
  @Input() viewType: string;

  @Input() objects: any;
  @Output() objectsChange: EventEmitter<any> = new EventEmitter();

  dragulaOptions: Object = {
    moves: (el, container, handle) => {
      return [
        'handle',
        'glyphicon glyphicon-move'
      ].includes(handle.className);
    },
    removeOnSpill: true
  };

  constructor(
    public ts: ToastService,
    public dragulaService: DragulaService ) {
    super(ts, dragulaService);
  }

}
