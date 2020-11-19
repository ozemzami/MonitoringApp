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
        canActivate: [AuthGuard]
      },
      {
        path: 'offers',
        loadChildren: () => import('../modules/offer/offer.module').then(m => m.OfferModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'tracker',
        loadChildren: () => import('../modules/tracker/tracker.module').then(m => m.TrackerModule),
        canActivate: [AuthGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppTemplateRoutingModule { }
