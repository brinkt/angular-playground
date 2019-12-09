/* tslint:disable:directive-selector */

import { Directive, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, ValidatorFn, Validators } from '@angular/forms';

export function equalToValidator(val: string): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => {
    if (control.value !== val && val !== '') {
      return {'equalTo': control.value};
    }
    return null;
  };
}

@Directive({
  selector: '[equalTo]',
  providers: [{provide: NG_VALIDATORS, useExisting: EqualToValidatorDirective, multi: true}]
})
export class EqualToValidatorDirective implements Validator, OnChanges {
  @Input() equalTo: string;
  private valFn = Validators.nullValidator;

  ngOnChanges(changes: SimpleChanges): void {
    const change = changes['equalTo'];
    if (change) {
      this.valFn = equalToValidator(change.currentValue);
    } else {
      this.valFn = Validators.nullValidator;
    }
  }

  validate(control: AbstractControl): {[key: string]: any} {
    return this.valFn(control);
  }
}
