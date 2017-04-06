import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api/api.service';
import { AF } from '../providers/af';

import { Movie } from '../model/movie';
import { MovieVideo } from '../model/movie-video';
import { Person } from '../model/person';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'movie',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.css']
})
export class MovieDetailComponent implements OnInit {

  private videos: MovieVideo[];
  private recommendedMovies: Movie[];
	movie: Movie;
  private player;
  private ytEvent;

  constructor(public apiService: ApiService,
  	private route: ActivatedRoute,
  	private router: Router,
  	public afService: AF
  	) {}

  onStateChange(event) {
    this.ytEvent = event.data;
  }
  savePlayer(player) {
    this.player = player;
  }

  cast(): Person[] {
    return Array.from(this.movie.castCharacterMap.keys());
  }

  characterForActor(actor: Person): string {
    return this.movie.castCharacterMap.get(actor);
  }

  crew(): Person[] {
    return Array.from(this.movie.crewJobMap.keys());
  }

  jobForCrewPerson(crewPerson: Person): string {
    return this.movie.crewJobMap.get(crewPerson);
  }

  ngOnInit() {
  	//subscribe to changes in id in the URL
  	const movie = this.route.params
      .switchMap((params: Params) => this.apiService.getMovie(+params['id']))
      .share();

    movie.subscribe(movie => this.movie = movie);

    movie
      .switchMap(movie => this.apiService.getMovieVideos(movie.id))
      .subscribe(videos => this.videos = videos);

    movie
      .switchMap(movie => this.apiService.getRecommendedMovies(movie.id))
      .subscribe(movies => this.recommendedMovies = movies);

  }
}
