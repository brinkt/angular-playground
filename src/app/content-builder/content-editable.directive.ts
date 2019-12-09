import { Input, Output, Directive, ElementRef,
  EventEmitter, OnInit, HostListener } from '@angular/core';

@Directive({
  selector: '[appContentEditable]'
})

export class ContentEditableDirective implements OnInit {
  @Input() myProperty;
  @Output() myPropertyChange: EventEmitter<any> = new EventEmitter();

  private start: string;

  constructor(
    private el: ElementRef ) {}

  /*---------------------------------------------------------------------------
    mouseleave:
  ---------------------------------------------------------------------------*/

  @HostListener('click') click() {
    if (!this.start) { this.start = this.el.nativeElement.innerText; }
  }

  /*---------------------------------------------------------------------------
    mouseleave:
  ---------------------------------------------------------------------------*/

  @HostListener('mouseleave') update() {
    const latest: string = this.el.nativeElement.innerText;
    if (this.start && latest !== this.start) {
      this.start = latest;
      this.myPropertyChange.emit(latest);
    }
  }

  /*---------------------------------------------------------------------------
    ngOnInit:
  ---------------------------------------------------------------------------*/

  ngOnInit() {
    this.el.nativeElement.innerText =  this.myProperty;
  }

  /*-------------------------------------------------------------------------*/
}
