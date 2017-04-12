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

  swiperConfig: Object = {
            pagination: '.swiper-pagination',
            slidesPerView: 'auto',
            paginationClickable: true,
            spaceBetween: 30
          };

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
  }

  titleString(movie: Movie): string {
    const releaseDate = movie.releaseDate;
    return releaseDate
      ? `${movie.title} (${releaseDate.split('-')[0]})`
      : `${movie.title}`;
  }
}
