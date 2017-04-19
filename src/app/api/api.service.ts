import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Movie } from '../model/movie';
import { Person } from '../model/person';
import { User } from '../model/user';
import { MediaItem, MediaType } from '../model/media-item';
import { MovieVideo } from '../model/movie-video';

import { ApiToModelMapper } from './apiToModelMapper';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class ApiService {
	private static APIKey: string = "99d34030725aed23c5f81fe23241d83e";
	private static imageBaseURL: string = "https://image.tmdb.org/t/p/w500";

	private searchURL(type: string, query: string): string {
		return `https://api.themoviedb.org/3/search/${type}?api_key=${ApiService.APIKey}&query=${query}`;
	}

	private getByIdURL(type: string, id: number, additional: string, appendToResponseStrings: string[] = []): string {
		const append = appendToResponseStrings.length > 0
			? `&append_to_response=${appendToResponseStrings.reduce((acc,s) => `${acc},${s}`)}`
			: "";
		var str = additional ? `/${additional}` : "";
		return `https://api.themoviedb.org/3/${type}/${id}${str}?api_key=${ApiService.APIKey}${append}`;
	}

	private getHotNewMoviesURL(): string {
		const todaysDate = new Date();
		const endDateStr = todaysDate.toISOString().substring(0,10);
		todaysDate.setMonth(todaysDate.getMonth()-1);
		const startDateStr = todaysDate.toISOString().substring(0,10);
		return `https://api.themoviedb.org/3/discover/movie?api_key=c4c310d31261b52644239b9e959bd9cc&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&primary_release_date.gte=${startDateStr}&primary_release_date.lte=${endDateStr}`
	}

	private getUpcomingMoviesURL(): string {
		const todaysDate = new Date();
		const todaysDateStr = todaysDate.toISOString().substring(0,10);
		return `https://api.themoviedb.org/3/discover/movie?api_key=c4c310d31261b52644239b9e959bd9cc&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&primary_release_date.gte=${todaysDateStr}`
	}

	constructor(private http: Http) {}

	getMovie(id: number): Observable<Movie> {
		const url: string = this.getByIdURL('movie', id, null, ['credits']);
		return this.http.get(url)
			.map(resp => resp.json())
			.map(ApiToModelMapper.movieFromJson);
	}

	getMovieVideos(id: number): Observable<MovieVideo[]> {
		const url: string = this.getByIdURL('movie', id, 'videos');
		return this.http.get(url)
			.map(this.extractResults)
			.map(results => results.map(ApiToModelMapper.movieVideoFromJson))
			.map(videos => videos.filter(video => video != null));
	}

	getRecommendedMovies(id: number): Observable<Movie[]> {
		const url: string = this.getByIdURL('movie', id, 'recommendations');
		return this.http.get(url)
			.map(this.extractResults)
			.map(results => results.map(ApiToModelMapper.movieFromJson))
			.map(videos => videos.filter(video => video != null));
	}

	getRecommendedMoviesForUser(user: User, numberOfMovies: number): Observable<Movie[]> {
		const numberOfFavourites = user.favouritelist.length;
		const recsFromEachMovie = Math.ceil(numberOfMovies / numberOfFavourites);

		const recObservables = user.favouritelist
			.map(movie =>
				this.getRecommendedMovies(movie.id)
					.map(movies => this.getNRandomElements(movies, recsFromEachMovie))
			);

		return Observable.zip(...recObservables)
			.map(movieLists => movieLists.reduce((acc,ms) => acc.concat(ms)), [])
			.map(movies => movies.splice(0, numberOfMovies));
	}

	// Get a given number of random elements from an array
	private getNRandomElements<T>(array: T[], numberOfElements: number): T[] {
		if (numberOfElements >= array.length) { return array; }

		var indexes: number[] = [];
		while (indexes.length < numberOfElements) {
    	var randIndex = Math.floor(Math.random() * array.length);
    	if (indexes.indexOf(randIndex) > -1) continue;
    	indexes[indexes.length] = randIndex;
		}

		var resultArray = [];
		indexes.forEach(index => {
			resultArray.push(array[index]);
		});
		return resultArray;
	}

	getHotNewMovies(numberOfMovies: number): Observable<Movie[]> {
		const url = this.getHotNewMoviesURL();
		return this.http.get(url)
			.map(this.extractResults)
			.map(results => results.map(ApiToModelMapper.movieFromJson))
			.map(videos => videos.filter(video => video != null));
	}

	getUpcomingMovies(numberOfMovies: number): Observable<Movie[]> {
		const url = this.getUpcomingMoviesURL();
		return this.http.get(url)
			.map(this.extractResults)
			.map(results => results.map(ApiToModelMapper.movieFromJson))
			.map(videos => videos.filter(video => video != null));
	}

	searchMovies(query: string): Observable<Movie[]> {
		const url: string = this.searchURL('movie', query);
		return this.http.get(url)
			.map(this.extractResults)
			.map(results => results.map(ApiToModelMapper.movieFromJson));
	}

	searchPeople(query: string): Observable<Person[]> {
		const url: string = this.searchURL('person', query);
		return this.http.get(url)
			.map(this.extractResults)
			.map(results => results.map(ApiToModelMapper.personFromJson));
	}

	getPerson(id: number): Observable<Person> {
		const url: string = this.getByIdURL('person', id, null);
		return this.http.get(url)
			.map(resp => {
				return ApiToModelMapper.personFromJson(resp.json());
			});
	}

	getTaggedPhotos(id: number): Observable<String[]> {
		const imgBaseUrl = "https://image.tmdb.org/t/p/w500";
		const url: string = this.getByIdURL('person', id, 'images');
		return this.http.get(url)
			.map(response => response.json().profiles)
			.map(results => results.map(res => imgBaseUrl + res.file_path));
	}

	getMovieCredits(id: number): Observable<Movie[]> {
		const url: string = this.getByIdURL('person', id, 'movie_credits');
		return this.http.get(url) 
			.map(resp => resp.json().cast.map(res => ApiToModelMapper.movieFromJson(res)));
	}

	searchMediaItems(query: string): Observable<MediaItem[]> {
		const url: string = this.searchURL('multi', query);
		return this.http.get(url)
			.map(this.extractResults)
			.map(results => results.map(ApiToModelMapper.mediaItemFromJson))
			.map(mediaItems => mediaItems.filter(item => item != null));
	}

	private extractResults(response: Response): any[] {
		return response.json().results as any[];
	}
}
