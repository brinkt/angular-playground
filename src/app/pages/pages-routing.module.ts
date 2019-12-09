import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PageIndexComponent } from './index/index';
import { PageShowComponent } from './show/show';

const pagesRoutes: Routes = [
  { path: '', component: PageShowComponent },
  { path: 'pages', component: PageIndexComponent },
  { path: ':id', component: PageShowComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(pagesRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class PagesRoutingModule {}
