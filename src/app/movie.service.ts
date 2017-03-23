import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Movie } from './model/movie';
import { Person } from './model/person';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

@Injectable()
export class MovieService {
	private APIKey: string = "99d34030725aed23c5f81fe23241d83e";
	private MovieSearchURL: string = "https://api.themoviedb.org/3/search/movie?api_key=";
	private PersonSearchURL: string = "https://api.themoviedb.org/3/search/person?api_key=";

	movies: Movie[] = [];
	people: Person[] = [];
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
	     	})

	     	// handle any errors in the api request
	     	//catch(); TODO
	}

	downloadPeople(query: string) {

		this.people = [];
		const url:string = `${this.PersonSearchURL}${this.APIKey}&query=${query}`;
		this.isLoadingMovies = true;
		
		this.http.get(url)
			.map(resp => {
	        	const list = resp.json().results as any[];
	        	return list.map(this.personFromJson);
	      	})
	     
	      	// convert the Observable to a promise
	      	.toPromise()
	      	.then(people => {
	        	// update dishes array when download is complete
	        	this.people = people;
	        	console.log(people);
	     	})

	     	// handle any errors in the api request
	     	//catch(); TODO
	}
	movieFromJson(json: any): Movie {
		if(json == undefined ){ return undefined; }

		var movie = new Movie();
		movie.title = json.title as string;
		movie.id = json.id as number;
		if(json.poster_path == undefined) { 
			movie.imageUrl = "http://2.bp.blogspot.com/-NBniP7HEcqw/UJgO7lopaII/AAAAAAAACCs/u5X5wEimHoI/s1600/not-found.png"
		} else {
			movie.imageUrl = "https://image.tmdb.org/t/p/w500" + json.poster_path as string;
		}
		movie.overview = json.overview as string;

		return movie;
	}

	personFromJson(json: any): Person {
		if(json == undefined ){ return undefined; }

		var person = new Person();
		person.name = json.name as string;
		person.id = json.id as number;
		if(json.profile_path == undefined) { 
			person.imageUrl = "http://2.bp.blogspot.com/-NBniP7HEcqw/UJgO7lopaII/AAAAAAAACCs/u5X5wEimHoI/s1600/not-found.png"
		} else {
			person.imageUrl = "https://image.tmdb.org/t/p/w500" + json.profile_path as string;
		}

		return person;
	}



}
