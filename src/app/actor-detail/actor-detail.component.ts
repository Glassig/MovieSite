import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ApiService } from '../api/api.service';
import { Person } from '../model/person';
import { Movie } from '../model/movie';

@Component({
  selector: 'actor',
  templateUrl: './actor-detail.component.html',
  styleUrls: ['./actor-detail.component.css']
})
export class ActorDetailComponent implements OnInit {

	person: Person;
	movieCredits: Movie[];

    constructor(public apiService: ApiService,
  	private route: ActivatedRoute,
  	private router: Router,
  	) {}

  	navigateToMovieDetail(movie: Movie) {
  		this.router.navigate(['/movie', movie.id]);
  	} 

  ngOnInit() {
  	//subscribe to changes in id in the URL
  	const person = this.route.params
      .switchMap((params: Params) => this.apiService.getPerson(+params['id']))
      .share();

    person.subscribe(person => this.person = person);

    const movieCredits = this.route.params
      .switchMap((params: Params) => this.apiService.getMovieCredits(+params['id']))
      .share();

    movieCredits.subscribe(movieCredits => {
    	return this.movieCredits = movieCredits.length > 8 ? movieCredits.slice(0,8) : movieCredits;
    });
  }

}
