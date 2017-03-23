import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Movie } from './model/movie';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

@Injectable()
export class MovieService {
	private APIKey: string = "99d34030725aed23c5f81fe23241d83e";
	private MovieSearchURL: string = "https://api.themoviedb.org/3/search/movie?api_key=";

	movies: Movie[] = [];
	isLoadingMovies = false;

	constructor(private http: Http) {}

	downloadMovies(query: string) {

		this.movies = [];
		const url:string = `${this.MovieSearchURL}${this.APIKey}&query=${query}`;
		this.isLoadingMovies = true;
		
		this.http.get(url)
			.map(resp => {
	        	const list = resp.json().results as any[];
	        	return list.map(this.movieFromJson);
	      	})
	     
	      	// convert the Observable to a promise
	      	.toPromise()
	      	.then(movies => {
	        	// update dishes array when download is complete
	        	this.movies = movies
	        	// also set isLoadingDishes to false
	        	this.isLoadingMovies = false
	        	console.log(this.movies);
	     	})

	     	// handle any errors in the api request
	     	//catch(); TODO
	}

	movieFromJson(json: any): Movie {
		if(json == undefined ){ return undefined; }

		var movie = new Movie();
		movie.title = json.title as string;
		movie.id = json.id as number;
		movie.imageUrl = "https://image.tmdb.org/t/p/w500" + json.poster_path as string;
		movie.overview = json.overview as string;

		return movie;
	}



}
