import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { RegExpValidatorDirective } from '../shared/form/regexp-validator.directive';
import { EqualToValidatorDirective } from '../shared/form/equal-validator.directive';
import { FormErrorMessageComponent } from '../shared/form/form-error-message.component';

import { AuthAccountComponent } from './account/account';
import { AuthAccountFormComponent } from './account/account-form';
import { AuthHelperComponent } from './helper/helper';
import { AuthLinksComponent } from './links/links';
import { AuthLoginComponent } from './login/login';
import { AuthNavComponent } from './nav/nav';
import { AuthPasswordChangeComponent } from './password/password-change';
import { AuthRegisterComponent } from './register/register';
import { AuthTokenHelperComponent } from './token/token';
import { AuthUsernameFormComponent } from './username/form';

import { AuthRoutingModule } from './auth-routing.module';

import { AuthInterceptor } from './auth.interceptor';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AuthRoutingModule
  ],
  declarations: [
    RegExpValidatorDirective,
    EqualToValidatorDirective,
    FormErrorMessageComponent,
    AuthAccountComponent,
    AuthAccountFormComponent,
    AuthHelperComponent,
    AuthLinksComponent,
    AuthLoginComponent,
    AuthNavComponent,
    AuthPasswordChangeComponent,
    AuthRegisterComponent,
    AuthTokenHelperComponent,
    AuthUsernameFormComponent
  ],
  providers: [
    AuthInterceptor,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    }
  ],
  exports: [ AuthNavComponent ]
})
export class AuthModule {}
