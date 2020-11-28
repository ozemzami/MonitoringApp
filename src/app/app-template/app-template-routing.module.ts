import { Role } from './../core/authentication/role.enum';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppTemplateComponent } from './app-template.component';
import { AuthGuard } from '../core/helpers/auth.guard';

const routes: Routes = [
  {
    path: '', component: AppTemplateComponent,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../modules/home/home.module').then(m => m.HomeModule),
        canActivate: [AuthGuard],
        data: {
          expectedRights: [Role.USER]
        }
      },
      {
        path: 'offers',
        loadChildren: () => import('../modules/offer/offer.module').then(m => m.OfferModule),
        canActivate: [AuthGuard],
        data: {
          expectedRights: [Role.USER]
        }
      },
      {
        path: 'tracker',
        loadChildren: () => import('../modules/tracker/tracker.module').then(m => m.TrackerModule),
        canActivate: [AuthGuard],
        data: {
          expectedRights: [Role.USER]
        }
      },
      {
        path: 'users',
        loadChildren: () => import('../modules/users/users.module').then(m => m.UsersModule),
        canActivate: [AuthGuard],
        data: {
          expectedRights: [Role.ADMIN]
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppTemplateRoutingModule { }
