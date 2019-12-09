import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModelService } from './model.service';

import { SharedViewTypesComponent } from './view-types';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    SharedViewTypesComponent
  ],
  exports: [
    SharedViewTypesComponent
  ],
  providers: [ ModelService ]
})
export class ModelModule {}
