import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DragulaModule } from 'ng2-dragula/ng2-dragula';

import { ContentEditableDirective } from './content-editable.directive';
import { ContentElementComponent } from './content-element.component';
import { ContentBuilderComponent } from './content-builder.component';

import { DynamicTextComponent } from './elements/dynamic-text.component';
import { DynamicQuoteComponent } from './elements/dynamic-quote.component';
import { DynamicYoutubeComponent } from './elements/dynamic-youtube.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DragulaModule
  ],
  declarations: [
    ContentEditableDirective,
    ContentElementComponent,
    ContentBuilderComponent,
    DynamicTextComponent,
    DynamicQuoteComponent,
    DynamicYoutubeComponent
  ],
  providers: [ ],
  exports: [
    ContentBuilderComponent
  ],
  entryComponents: [
    DynamicTextComponent,
    DynamicQuoteComponent,
    DynamicYoutubeComponent
  ]
})
export class ContentBuilderModule {}
