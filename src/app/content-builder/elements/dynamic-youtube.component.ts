import { Component, ElementRef } from '@angular/core';
import { DynamicComponent } from './dynamic.component';

@Component({
  selector: 'app-dynamic-youtube',
  styleUrls: [ './dynamic-youtube.scss' ],
  template: `
  <div class="youTube youTubeEdit" style="width: {{width()}}px; height: {{height()}}px;"
    *ngIf="viewType == 'edit'">
    <div class="ytCenter">
      <div>Youtube Embed Code</div>
      <div appContentEditable="true" contenteditable="true" [(myProperty)]="model.data"></div>
    </div>
  </div>
  <div class="youTube" *ngIf="viewType == 'show'">
    <iframe width="{{width()}}" height="{{height()}}" src="https://www.youtube.com/embed/{{model.data}}"
    frameborder="0" allowfullscreen></iframe>
  </div>
`
})
export class DynamicYoutubeComponent extends DynamicComponent {
  constructor(
    private elementRef: ElementRef ) {
    super();
  }

  width() {
    return this.elementRef.nativeElement.parentElement.offsetWidth;
  }

  height() {
    return Math.round( this.elementRef.nativeElement.parentElement.offsetWidth / 1.77 );
  }
}
