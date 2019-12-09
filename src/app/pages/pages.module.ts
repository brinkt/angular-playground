import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ModelModule } from '../shared/model/model.module';

import { PageShowComponent } from './show/show';
import { PageFormComponent } from './form/form';
import { PageIndexComponent } from './index/index';
import { PageTableComponent } from './index/table-tile/table';
import { PageTilesComponent } from './index/table-tile/tiles';
import { PageTileComponent } from './index/table-tile/tile';
import { PageTableTileControlsComponent } from './index/table-tile/controls';

import { NotFoundComponent } from './not-found/not-found.component';

import { PageService } from './page.service';

import { PagesRoutingModule } from './pages-routing.module';

import { ContentBuilderModule } from '../content-builder/content-builder.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ModelModule,
    ContentBuilderModule,
    PagesRoutingModule
  ],
  declarations: [
    PageShowComponent,
    PageFormComponent,
    PageIndexComponent,
    PageTableComponent,
    PageTilesComponent,
    PageTileComponent,
    PageTableTileControlsComponent,
    NotFoundComponent
  ],
  providers: [ PageService ]
})
export class PagesModule {}
