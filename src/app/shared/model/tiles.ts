import { OnChanges, SimpleChange } from '@angular/core';

export class ModelTiles implements OnChanges {
  watch: string;
  tilesArray: any[];

  constructor() {}

  /*---------------------------------------------------------------------------
    ngOnChanges:

    split single sorted {objs} array into multiple responsive arrays while
    maintaining top-to-bottom & left-to-right sort order
  ---------------------------------------------------------------------------*/

  ngOnChanges(changes: {[propName: string]: SimpleChange}) {
    if ( changes && this.watch && changes[this.watch] &&
      typeof changes[this.watch].currentValue !== 'undefined' ) {

      const ci = changes[this.watch].currentValue;
      this.tilesArray = [ [], [], [] ];

      let x = 0;
      for (const i of Object.keys(ci)) {
        this.tilesArray[x].push(ci[i]);
        if ( x < 2 ) {
          x += 1;
        } else if ( x === 2 ) {
          x = 0;
        }
      }
    }
  }

  /*-------------------------------------------------------------------------*/
}
