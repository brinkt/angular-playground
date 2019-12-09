import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthModule } from './auth/auth.module';
import { PagesModule } from './pages/pages.module';
import { UsersModule } from './users/users.module';

// import { AuthGuard } from './auth/auth-guard.service';

const appRoutes: Routes = [
  {
    path: 'users',
    loadChildren: './users/users.module#UsersModule'
  },
  {
    path: 'auth',
    loadChildren: './auth/auth.module#AuthModule'
    // canLoad: [AuthGuard]
  },
  {
    path: 'debug',
    loadChildren: './debug/debug.module#DebugModule'
    // canLoad: [AuthGuard]
  },
  {
    path: '',
    loadChildren: './pages/pages.module#PagesModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {}
