import { Role } from './../../authentication/role.enum';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { Component, OnInit } from '@angular/core';



declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  menuItems: any[];

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.menuItems = [
      { path: '/offers', title: 'Offers',  icon: 'local_offer', class: '' },
      { path: '/tracker', title: 'Tracker',  icon: 'track_changes', class: '' }
    ];
    if ( this.authenticationService.currentUserValue.role === Role.ADMIN ) {
      console.log(this.authenticationService.currentUserValue.role);
      this.menuItems.push({ path: '/users', title: 'Users',  icon: 'person', class: '' });
    }
  }

}
