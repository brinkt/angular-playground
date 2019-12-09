import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-links',
  templateUrl: './links.html'
})

export class AuthLinksComponent {

  constructor(
    private router: Router ) {}

  nav(e: any, route: string) {
    e.preventDefault();
    this.router.navigate([route]);
  }

  windowPath() {
    return window.location.pathname;
  }

}
