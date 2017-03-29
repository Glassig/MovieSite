import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api/api.service';
import { ApiToModelMapper } from '../api/apiToModelMapper';
import { AF } from '../providers/af';


import { Movie } from '../model/movie';
import { Router, ActivatedRoute, Params } from '@angular/router';

import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'movie',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.css']
})
export class MovieDetailComponent implements OnInit {

  private id;
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
  

  ngOnInit() {
  	//subscribe to changes in id in the URL
  	this.route.params
    .switchMap((params: Params) => this.apiService.getMovie(+params['id']))
    .subscribe((movie: Movie) => { 
      this.movie = movie; 
      this.apiService.getMovieTrailers(movie.id)
        .subscribe(keys => { 
          this.id = keys[0] ? keys[0] : undefined;
      }) 
    });
  }
}
