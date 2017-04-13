import { Component, Input } from '@angular/core';
import { Movie } from '../model/movie';

import { Router } from '@angular/router';

@Component({
  selector: 'movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.css']
})
export class MovieListComponent {
  @Input() movies: Movie[];
  @Input() size: string;

  constructor(private router: Router) {}

  swiperConfig: Object = {
            pagination: '.swiper-pagination',
            slidesPerView: 'auto',
            paginationClickable: true,
            spaceBetween: 30,
            autoplay: 2000,
            autoplayDisableOnInteraction: true
          };

  titleString(movie: Movie): string {
    const releaseDate = movie.releaseDate;
    return releaseDate
      ? `${movie.title} (${releaseDate.split('-')[0]})`
      : `${movie.title}`;
  }

  navigateToDetail(movie: Movie) {
		this.router.navigate(['/movie', movie.id]);
	}
}
