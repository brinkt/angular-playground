import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app/app.component';

import { AppRoutingModule } from './app-routing.module';
import { AuthModule } from './auth/auth.module';
import { PagesModule } from './pages/pages.module';
import { UsersModule } from './users/users.module';

import { AuthService } from './auth/auth.service';

import { ToastComponent } from './toast/toast';
import { ToastService } from './toast/toast.service';

import { LocalStorageDatabase } from './dual-backend/localstorage-database';
import { DualBackendModule } from './dual-backend/dual-backend.module';
import { DualBackendGeneratorUser } from './dual-backend/dual-backend-generator-user';
import { DualBackendGeneratorPage } from './dual-backend/dual-backend-generator-page';
import { DualBackendRoutesAuth } from './dual-backend/dual-backend-routes-auth';
import { DualBackendRoutesPage } from './dual-backend/dual-backend-routes-page';
import { DualBackendRoutesUser } from './dual-backend/dual-backend-routes-user';

/*-------------------------------------------------------------------------*/
// rxjs operators

import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/debounceTime';

import 'rxjs/add/observable/of';

/*-------------------------------------------------------------------------*/
// extend String

String.prototype.capitalize = function (this: string) {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.titleize = function (this: string) {
  let s = this.split(/[\s_-]+/);
  s = s.map(function(str){
    return str.capitalize();
  });
  return s.join(' ');
};

declare global {
  interface String {
    capitalize(): string;
    titleize(): string;
  }
}

/*-------------------------------------------------------------------------*/

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    HttpModule,
    AuthModule,
    DualBackendModule.forRoot({
      generators: [ DualBackendGeneratorUser, DualBackendGeneratorPage ],
      routes: [ DualBackendRoutesAuth, DualBackendRoutesPage,
        DualBackendRoutesUser ]
    }),
    AppRoutingModule,
    PagesModule,
    UsersModule
  ],
  declarations: [
    AppComponent,
    ToastComponent
  ],
  providers: [
    LocalStorageDatabase,
    AuthService,
    ToastService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
