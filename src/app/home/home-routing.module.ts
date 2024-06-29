import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {LandingComponent} from './landing/landing.component';
import {ProfileComponent} from './profile/profile.component';

const routes: Routes = [
  {
    path: 'Home',
    data: {
      breadcrumb: 'Home'
    },
    component: HomeComponent
  },
  {
    path: '',
    data: {
      breadcrumb: 'Landing'
    },
    component: LandingComponent
  },
  {
    path: 'Profile',
    data: {
      breadcrumb: 'Profile'
    },
    component: ProfileComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {
}

