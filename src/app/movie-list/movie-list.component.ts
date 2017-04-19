import { Component, OnInit, Input } from '@angular/core';
import { Movie } from '../model/movie';

import { Router } from '@angular/router';

@Component({
  selector: 'movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.css']
})
export class MovieListComponent implements OnInit {
  @Input() movies: Movie[];
  @Input() size: string;
  @Input() autoScroll: boolean = false;

  swiperConfig: Object;

  constructor(private router: Router) {}

  ngOnInit() {
    this.swiperConfig = {       
              pagination: '.swiper-pagination',
              nextButton: '.swiper-button-next',
              prevButton: '.swiper-button-prev',
              slidesPerView: 'auto',
              paginationClickable: true,
              spaceBetween: 30,
              autoplay: this.autoScroll ? 2500 : false,
              autoplayDisableOnInteraction: true
            };
  }

  titleString(movie: Movie): string {
    const releaseDate = movie.releaseDate;
    return releaseDate
      ? `${movie.title} (${new Date(releaseDate).getFullYear()})`
      : `${movie.title}`;
  }

  navigateToDetail(movie: Movie) {
		this.router.navigate(['/movie', movie.id]);
	}
}
