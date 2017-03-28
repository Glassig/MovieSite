import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { SearchMovieComponent } from '../search-movie/search-movie.component';
import { MyProfileComponent } from '../my-profile/my-profile.component';
import { MovieDetailComponent } from '../movie-detail/movie-detail.component';

const routes: Routes = [
  { path: '', redirectTo: '/search-movie', pathMatch: 'full' },
  { path: 'search-movie', component: SearchMovieComponent },
  { path: 'my-profile', component: MyProfileComponent },
  { path: 'movie/:id', component: MovieDetailComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
