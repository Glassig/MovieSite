import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api/api.service';
import { AF } from '../providers/af';

import {MdSnackBar} from '@angular/material';

import { Movie } from '../model/movie';
import { MovieVideo } from '../model/movie-video';
import { Person } from '../model/person';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Review } from '../model/review';

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
  private hasReviewed: boolean = false;

  constructor(public apiService: ApiService,
  	private route: ActivatedRoute,
  	private router: Router,
  	public afService: AF,
    public snackBar: MdSnackBar
  	) {}

  onStateChange(event) {
    this.ytEvent = event.data;
  }
  savePlayer(player) {
    this.player = player;
  }
  openSnackbar(message: string) {
    this.snackBar.open(message, '', { duration: 2000 });
  }

  cast(): Person[] {
    return Array.from(this.movie.castCharacterMap.keys());
  }

  characterForActor(actor: Person): string {
    return this.movie.castCharacterMap.get(actor);
  }

  hasReviews(){
      return this.afService.movieReviews.lenght!=0;
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

    movie.subscribe(movie => {
      this.movie = movie;
      this.afService.initiateReviewSubscription(this.movie.id);

    });

    movie
      .switchMap(movie => this.apiService.getMovieVideos(movie.id))
      .subscribe(videos => this.videos = videos);

    movie
      .switchMap(movie => this.apiService.getRecommendedMovies(movie.id))
      .subscribe(movies => this.recommendedMovies = movies);

  }
}
