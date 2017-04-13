import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api/api.service';
import { AF } from '../providers/af';

import { Observable } from 'rxjs/Rx';
import { Movie } from '../model/movie';

@Component({
  selector: 'search-movie',
  templateUrl: './search-movie.component.html',
  styleUrls: ['./search-movie.component.css']
})
export class SearchMovieComponent implements OnInit {
  recommendedMovies: Observable<Movie[]>
  hotNewMovies: Observable<Movie[]>
  upcomingMovies: Observable<Movie[]>

  constructor(
    public apiService: ApiService,
  	public afService: AF
  	) {}

  ngOnInit() {
    this.recommendedMovies = this.afService.loggedInUser
      .switchMap(user =>
        user != null
          ? this.apiService.getRecommendedMoviesForUser(user, 20)
          : Observable.of([])
      )

    this.hotNewMovies = this.apiService.getHotNewMovies(10);
    this.upcomingMovies = this.apiService.getUpcomingMovies(10);
  }
}
