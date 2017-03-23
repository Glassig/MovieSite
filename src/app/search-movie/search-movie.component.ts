import { Component, OnInit } from '@angular/core';
import { MovieService } from '../movie.service';
import { Movie } from '../model/movie';

@Component({
  selector: 'search-movie',
  templateUrl: './search-movie.component.html',
  styleUrls: ['./search-movie.component.css']
})
export class SearchMovieComponent implements OnInit {

	searchQuery: string;
	searched: boolean = false;
	searchedMovies: Movie[] = [];

	constructor(public movieService: MovieService) { }

	ngOnInit() {
	}

	keyPress() {
		this.movieService.downloadMovies(this.searchQuery);
		this.searchedMovies = this.movieService.movies;
	}

}
