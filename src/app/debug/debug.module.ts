import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DebugComponent } from './debug.component';

const debugRoutes: Routes = [
  { path: '', component: DebugComponent }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(debugRoutes)
  ],
  declarations: [
    DebugComponent
  ],
  providers: []
})
export class DebugModule {}
