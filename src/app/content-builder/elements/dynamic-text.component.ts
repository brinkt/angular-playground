import { Component } from '@angular/core';
import { DynamicComponent } from './dynamic.component';

@Component({
  selector: 'app-dynamic-text',
  template: `
  <p appContentEditable="true" contenteditable="true" [(myProperty)]="model.data"
    *ngIf="model.category == 'p' && viewType == 'edit'">
    {{model.data}}
  </p>
  <p *ngIf="model.category == 'p' && viewType == 'show'"
    [innerHTML]="renderMarkup(model.data)">
  </p>

  <h1 appContentEditable="true" contenteditable="true" [(myProperty)]="model.data"
    *ngIf="model.category == 'h1' && viewType == 'edit'">
    {{model.data}}
  </h1>
  <h1 *ngIf="model.category == 'h1' && viewType == 'show'"
    [innerHTML]="renderMarkup(model.data)">
  </h1>

  <h2 appContentEditable="true" contenteditable="true" [(myProperty)]="model.data"
    *ngIf="model.category == 'h2' && viewType == 'edit'">
    {{model.data}}
  </h2>
  <h2 *ngIf="model.category == 'h2' && viewType == 'show'"
    [innerHTML]="renderMarkup(model.data)">
  </h2>

  <h3 appContentEditable="true" contenteditable="true" [(myProperty)]="model.data"
    *ngIf="model.category == 'h3' && viewType == 'edit'">
    {{model.data}}
  </h3>
  <h3 *ngIf="model.category == 'h3' && viewType == 'show'"
    [innerHTML]="renderMarkup(model.data)">
  </h3>
`
})
export class DynamicTextComponent extends DynamicComponent {}
