import { Component, OnInit } from '@angular/core';
import { MovieService } from '../movie.service';
import { Movie } from '../model/movie';
import { Person } from '../model/person';

@Component({
  selector: 'search-movie',
  templateUrl: './search-movie.component.html',
  styleUrls: ['./search-movie.component.css']
})
export class SearchMovieComponent implements OnInit {

	searchQuery: string;
	searchQuery2: string;
	searched: boolean = false;

	constructor(public movieService: MovieService) { }

	ngOnInit() {
	}

	keyPress() {
		this.movieService.downloadMovies(this.searchQuery);
	}

	keyPress2() {
		this.movieService.downloadPeople(this.searchQuery2);
	}

}
