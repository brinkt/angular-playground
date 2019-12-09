import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ModelModule } from '../shared/model/model.module';

import { UserIndexComponent } from './index/index';
import { UserShowComponent } from './show/show';
import { UserTableComponent } from './index/table-tile/table';
import { UserTilesComponent } from './index/table-tile/tiles';
import { UserTileComponent } from './index/table-tile/tile';
import { UserTableTileControlsComponent } from './index/table-tile/user-controls';

import { UserService } from './user.service';

import { UsersRoutingModule } from './users-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ModelModule,
    UsersRoutingModule
  ],
  declarations: [
    UserIndexComponent,
    UserShowComponent,
    UserTableComponent,
    UserTilesComponent,
    UserTileComponent,
    UserTableTileControlsComponent
  ],
  providers: [ UserService ]
})
export class UsersModule {}
