import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('navToggle') navToggle: ElementRef;

  constructor(
    private router: Router
  ) {
    // collapse navbar on route changes
    this.router.events.subscribe((e) => {
      if (e.constructor === NavigationEnd ) {
        if (this.navToggle && this.navToggle.nativeElement) {
          const navClasses: string[] = this.navToggle.nativeElement.className.split(' ');
          if (!navClasses.includes('collapsed')) {
            this.navToggle.nativeElement.click();
          }
        }
      }
    });
  }

}
