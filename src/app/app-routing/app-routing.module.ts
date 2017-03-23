import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { SearchMovieComponent } from '../search-movie/search-movie.component';

const routes: Routes = [
  { path: '', redirectTo: '/search-movie', pathMatch: 'full' },
  { path: 'search-movie', component: SearchMovieComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
