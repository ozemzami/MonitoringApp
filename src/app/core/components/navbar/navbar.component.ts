import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../authentication/authentication.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  title: string;
  titles = [
    {route: '/offers', title: 'Offers'},
    {route: '/tracker', title: 'Tracker'}
  ];

  constructor(private authService: AuthenticationService, private router: Router) { }

  ngOnInit() {
    this.title = this.titles.filter((title) => title.route === this.router.url)[0].title;
    this.router.events.subscribe(val => {
      if (val instanceof NavigationEnd) {
        this.title = this.titles.filter((title) => title.route === this.router.url)[0].title;
      }
    });
  }

  logout() {
    this.authService.logout();
  }

}
