import { Component, OnInit, Input } from '@angular/core';
import { Movie } from '../model/movie';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.css']
})
export class MovieCardComponent implements OnInit {
	@Input() movie: Movie;

  constructor(private router: Router) { }

  ngOnInit() {
  }

	navigateToMovieDetail() {
		this.router.navigate(['/movie', this.movie.id]);
	}
}
