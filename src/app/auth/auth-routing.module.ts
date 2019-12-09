import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthLoginComponent } from './login/login';
import { AuthHelperComponent } from './helper/helper';
import { AuthTokenHelperComponent } from './token/token';
import { AuthRegisterComponent } from './register/register';
import { AuthAccountComponent } from './account/account';
import { AuthPasswordChangeComponent } from './password/password-change';

const authRoutes: Routes = [
  { path: 'login',  component: AuthLoginComponent },
  { path: 'register', component: AuthRegisterComponent },
  { path: 'account', component: AuthAccountComponent },
  { path: 'confirm/instructions', component: AuthHelperComponent },
  { path: 'password/instructions', component: AuthHelperComponent },
  { path: 'unlock/instructions', component: AuthHelperComponent },
  { path: 'change/password', component: AuthPasswordChangeComponent },
  { path: 'token/email', component: AuthTokenHelperComponent },
  { path: 'token/unlock', component: AuthTokenHelperComponent },
  { path: 'token/password', component: AuthTokenHelperComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(authRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AuthRoutingModule {}
