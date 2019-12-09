import { EventEmitter } from '@angular/core';

export class DynamicComponent {

  model: any;
  viewType: string;

  modelChange: EventEmitter<string>;

  /*---------------------------------------------------------------------------
    renderMarkup:

    create links from Markdown syntax
  ---------------------------------------------------------------------------*/

  renderMarkup(data: string) {
    // create links from Markdown syntax
    while ( data.match(/\[.+\]\(htt(p|ps)\:\/\/.+\)/) ) {
      const link: string = data.match(/\[.+\]\(htt(p|ps)\:\/\/.+\)/)[0];
      const name: string = link.match(/\[.+\]/)[0].slice(1, -1);
      let url: string = link.slice(name.length + 2);
      url = url.match(/\(.+\)/)[0].slice(1, -1);

      const temp: string = `<a href="` + url + `" target="_blank">` + name + `</a>`;
      data = data.replace(link, temp);
    }
    return data;
  }

}
