import { EventEmitter, OnInit, OnDestroy } from '@angular/core';

import { ToastService } from '../toast/toast.service';

import { DragulaService } from 'ng2-dragula/ng2-dragula';

import { ISubscription } from 'rxjs/Subscription';

export class SharedContentBuilder implements OnInit, OnDestroy {
  objects: any;
  objectsChange: EventEmitter<any>;

  private dropSub: ISubscription;

  layouts: string[] = [
    '1',
    '1-1',
    '2-1',
    '1-2',
    '1-1-1'
  ];

  constructor(
    public ts: ToastService,
    public dragulaService: DragulaService ) {}

  /*---------------------------------------------------------------------------
    ngOnInit:

    renders the intial objects into the dynamic layout
  ---------------------------------------------------------------------------*/

  ngOnInit() {
    // load data
    this.reloadObjects();

    this.dropSub = this.dragulaService.dropModel.subscribe((value) => {
      // emit objects upstream on drop
      this.objectsChange.emit(this.objects);
    });
  }

  /*---------------------------------------------------------------------------
    ngOnDestroy:
  ---------------------------------------------------------------------------*/

  ngOnDestroy() {
    this.dropSub.unsubscribe();
  }

  /*---------------------------------------------------------------------------
    changeLayout:

    switch to a new layout without losing objects
  ---------------------------------------------------------------------------*/

  changeLayout(e) {
    this.objects.layout = e.target.value;
    this.reloadObjects();
  }

  /*---------------------------------------------------------------------------
    layoutTemplate:

    returns empty layout object
  ---------------------------------------------------------------------------*/

  layoutTemplate(key: string): Array<Object> {
    const data = {
      '1': [{ css: 'col-sm-1 col-md-12', elements: [] }],
      '1-1': [
        { css: 'col-sm-1 col-md-6', elements: [] },
        { css: 'col-sm-1 col-md-6', elements: [] }
      ],
      '2-1': [
        { css: 'col-sm-1 col-md-7', elements: [] },
        { css: 'col-sm-1 col-md-5', elements: [] }
      ],
      '1-2': [
        { css: 'col-sm-1 col-md-5', elements: [] },
        { css: 'col-sm-1 col-md-7', elements: [] }
      ],
      '1-1-1': [
        { css: 'col-sm-1 col-md-4', elements: [] },
        { css: 'col-sm-1 col-md-4', elements: [] },
        { css: 'col-sm-1 col-md-4', elements: [] }
      ]
    };

    if (!data[key]) { throw new Error('invalid layout!'); }

    return data[key];
  }

  /*---------------------------------------------------------------------------
    reloadObjects:
  ---------------------------------------------------------------------------*/

  reloadObjects() {
    if (!this.objects) { return; }

    // default to first layout (if not in list)
    if (!this.layouts.includes(this.objects.layout)) {
      this.objects.layout = this.layouts[0];
    }

    const newObjs: any[] = this.layoutTemplate(this.objects.layout);

    if (this.objects.data) {
      for (const key of Object.keys(this.objects.data)) {
        let index: number = parseInt(key, 10);

        // if array index outside bounds, set to last index
        if ( index > newObjs.length - 1 ) { index = newObjs.length - 1; }

        for (const e of Object.keys(this.objects.data[key].elements)) {
          newObjs[index].elements.push(
            this.objects.data[key].elements[e]
          );
        }
      }
    }
    this.objects.data = newObjs;

    // emit objects upstream
    this.objectsChange.emit(this.objects);
  }

  /*---------------------------------------------------------------------------
    isComponent:
  ---------------------------------------------------------------------------*/

  isComponent(item: any) {
    const elements: any = ['text', 'quote', 'youtube'];
    if ( elements.indexOf(item.name) === -1 ) {
      return true;
    } else {
      return false;
    }
  }

  /*---------------------------------------------------------------------------
    addText:
  ---------------------------------------------------------------------------*/

  addText(name: string, message: string) {
    this.objects.data[0].elements.unshift({
      name: 'text',
      data: message,
      category: name
    });
    this.ts.toast([{key: 'success', value: name + ': successfully added'}]);
  }

  /*---------------------------------------------------------------------------
    addQuote:
  ---------------------------------------------------------------------------*/

  addQuote() {
    this.objects.data[0].elements.unshift({
      name: 'quote',
      data: 'I said something important!',
      source: 'Someone Famous'
    });
    this.ts.toast([{key: 'success', value: 'quote: successfully added'}]);
  }

  /*---------------------------------------------------------------------------
    addYoutube:
  ---------------------------------------------------------------------------*/

  addYoutube(code: string) {
    this.objects.data[0].elements.unshift({
      name: 'youtube',
      data: code
    });
    this.ts.toast([{key: 'success', value: 'youtube: successfully added'}]);
  }

  /*-------------------------------------------------------------------------*/
}
