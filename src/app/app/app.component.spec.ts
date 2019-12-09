/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';

import 'rxjs/add/operator/map';
import { AuthService } from '../auth/auth.service';
import { AuthNavComponent } from '../auth/nav/nav';
import { ToastComponent } from '../toast/toast';
import { ToastService } from '../toast/toast.service';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule
      ],
      declarations: [
        AppComponent,
        AuthNavComponent,
        ToastComponent
      ],
      providers: [ AuthService, ToastService ]
    });
    TestBed.compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

});
