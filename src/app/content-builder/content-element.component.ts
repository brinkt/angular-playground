import {
  Component, Input, OnInit, OnDestroy, SimpleChange, ElementRef,
  ComponentFactoryResolver, ComponentRef, ViewChild, ViewContainerRef,
  Output, EventEmitter
} from '@angular/core';

import { DynamicComponent } from './elements/dynamic.component';
import { DynamicTextComponent } from './elements/dynamic-text.component';
import { DynamicQuoteComponent } from './elements/dynamic-quote.component';
import { DynamicYoutubeComponent } from './elements/dynamic-youtube.component';

import { ToastService } from '../toast/toast.service';

@Component({
  selector: 'app-content-element',
  styleUrls: [ './content-element.component.scss' ],
  template: `
  <span class="handle" *ngIf="viewType == 'edit'">
    <span class="glyphicon glyphicon-move"></span>
  </span>
  <div class="contentElement">
    <div #container></div>
  </div>
`
})

export class ContentElementComponent implements OnInit, OnDestroy {
  @ViewChild('container', { read: ViewContainerRef })
  container: ViewContainerRef;

  @Input() model: any;
  @Output() modelChange: EventEmitter<string> = new EventEmitter();

  @Input() viewType: any;

  private componentRef: ComponentRef<{}>;

  private componentsMap = {
    'text': DynamicTextComponent,
    'quote': DynamicQuoteComponent,
    'youtube': DynamicYoutubeComponent
  };

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private elementRef: ElementRef ) {}

  /*---------------------------------------------------------------------------
    ngOnInit:

    render automatically upon load
  ---------------------------------------------------------------------------*/

  ngOnInit() {
    this.doRender(this.model);

    // paste as text only, not rich text
    this.elementRef.nativeElement.addEventListener('paste', function(e) {
      e.preventDefault();
      const text = e.clipboardData.getData('text/plain');
      document.execCommand('insertHTML', false, text);
    });
  }

  ngOnDestroy() {
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }

  /*---------------------------------------------------------------------------
    onChanges:

    re-render if the model data changes on the parent
  ---------------------------------------------------------------------------*/

  onChanges(changes: {[key: string]: SimpleChange}) {
    if (changes && changes['model']) {
      this.doRender(changes['model'].currentValue);
    }
  }

  /*---------------------------------------------------------------------------
    doRender:
  ---------------------------------------------------------------------------*/

  doRender(model: any) {
    if (model.name) {
      // components must be declared within module.entryComponents
      const factory = this.componentFactoryResolver.resolveComponentFactory(
        this.componentsMap[model.name]
      );
      this.container.clear();
      this.componentRef = this.container.createComponent(factory);

      // tie model
      const instance = <DynamicComponent> this.componentRef.instance;
      instance.model = model;
      instance.viewType = this.viewType;
      instance.modelChange = this.modelChange;
    }
  }

  /*-------------------------------------------------------------------------*/
}
