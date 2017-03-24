import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Movie } from '../model/movie';
import { Person } from '../model/person';

import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';

// Observable class extensions
import 'rxjs/add/observable/of';

// Observable operators
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';

@Component({
  selector: 'search-movie',
  templateUrl: './search-movie.component.html',
  styleUrls: ['./search-movie.component.css']
})
export class SearchMovieComponent implements OnInit {
  private movieSearchTerms = new Subject<string>();
  private peopleSearchTerms = new Subject<string>();
	movies: Observable<Movie[]>;
  people: Observable<Person[]>;
  moviesBoxVisible: boolean = false;
  peopleBoxVisible: boolean = false;

	constructor(public apiService: ApiService) { }

	ngOnInit() {
    this.initialiseMovies();
    this.initialisePeople();
	}

  private initialiseMovies() {
    this.movies = this.movieSearchTerms
      .debounceTime(300)
      .distinctUntilChanged()
      .switchMap(term => term ? this.apiService.getMovies(term) : Observable.of<Movie[]>([]))
      //only display first 8 movies
      .map(movies => movies.slice(0,8))
      .do(movies => { this.moviesBoxVisible = movies.length > 0; });
  }

  private initialisePeople() {
    this.people = this.peopleSearchTerms
      .debounceTime(300)
      .distinctUntilChanged()
      .switchMap(term => term ? this.apiService.getPeople(term) : Observable.of<Person[]>([]))
      //only display first 8 people
      .map(people => people.slice(0,8))
      .do(people => { this.peopleBoxVisible = people.length > 0; });
  }

  searchMovies(movieQuery: string) {
    this.movieSearchTerms.next(movieQuery);
  }

  searchPeople(movieQuery: string) {
    this.peopleSearchTerms.next(movieQuery);
  }

  setMovieBoxVisibility(visible: boolean) {
    this.moviesBoxVisible = visible;
  }

  setPeopleBoxVisibility(visible: boolean) {
    this.peopleBoxVisible = visible;
  }
}
