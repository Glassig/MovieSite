import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { SearchMovieComponent } from '../search-movie/search-movie.component';
import { LoginComponent } from '../login/login.component';
import { MyProfileComponent } from '../my-profile/my-profile.component';

const routes: Routes = [
  { path: '', redirectTo: '/search-movie', pathMatch: 'full' },
  { path: 'search-movie', component: SearchMovieComponent },
  { path: 'login', component: LoginComponent },
  { path: 'my-profile', component: MyProfileComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
