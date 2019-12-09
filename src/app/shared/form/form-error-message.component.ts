import { Component, Input, OnChanges, SimpleChange, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-form-error-message',
  templateUrl: './form-error-message.component.html'
})

export class FormErrorMessageComponent implements OnChanges {
  @Input() control: any;
  @Input() value: any;
  @Input() messages: any;

  formErrors = '';

  ngOnChanges(changes: {[key: string]: SimpleChange}) {
    if (changes['value']) {
      this.formErrors = '';
      if (this.control && this.control.dirty && !this.control.valid) {
        for (const key of Object.keys(this.control.errors)) {
          this.formErrors += this.messages[this.control.name][key] + ' ';
        }
      }
    }
  }

}
