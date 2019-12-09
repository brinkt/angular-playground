import { NgModule, ModuleWithProviders } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { DualBackendConfig, DualBackendInterceptor } from './dual-backend.interceptor';

@NgModule({
  providers: [
    DualBackendInterceptor,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: DualBackendInterceptor,
      multi: true,
    }
  ]
})
export class DualBackendModule {

  static forRoot(config: Object): ModuleWithProviders {
    return {
      ngModule: DualBackendModule,
      providers: [
        { provide: DualBackendConfig, useValue: config }
      ]
    };
  }

}
