import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api/api.service';
import { ApiToModelMapper } from '../api/apiToModelMapper';

import { Movie } from '../model/movie';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'movie',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.css']
})
export class MovieDetailComponent implements OnInit {

	movie: Movie;	

  constructor(public apiService: ApiService, 
  	private route: ActivatedRoute,
  	private router: Router
  	) {}

  ngOnInit() {
  	var id = +this.route.snapshot.params['id'];
  	this.apiService.getMovie(id)
  	.subscribe(movie => {
  		this.movie = movie;
  	});
  }

}
