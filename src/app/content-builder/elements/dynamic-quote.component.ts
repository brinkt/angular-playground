import { Component } from '@angular/core';
import { DynamicComponent } from './dynamic.component';

@Component({
  selector: 'app-dynamic-quote',
  template: `
  <blockquote *ngIf="viewType == 'edit'">
    <p appContentEditable="true" contenteditable="true" [(myProperty)]="model.data">
      {{model.data}}
    </p>
    <footer appContentEditable="true" contenteditable="true" [(myProperty)]="model.source">
      {{model.source}}
    </footer>
  </blockquote>
  <blockquote *ngIf="viewType == 'show'">
    <p [innerHTML]="renderMarkup(model.data)"></p>
    <footer [innerHTML]="renderMarkup(model.source)"></footer>
  </blockquote>
`
})
export class DynamicQuoteComponent extends DynamicComponent {}
