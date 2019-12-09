import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserIndexComponent } from './index/index';
import { UserShowComponent } from './show/show';

const usersRoutes: Routes = [
  { path: '',  component: UserIndexComponent },
  { path: 'user/:username', component: UserShowComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(usersRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class UsersRoutingModule {}
