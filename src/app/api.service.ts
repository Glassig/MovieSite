import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Movie } from './model/movie';
import { Person } from './model/person';
import { MediaItem, MediaType } from './model/media-item';

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

	private getByIdURL(type: string, id: number): string {
		return `https://api.themoviedb.org/3/${type}/${id}?api_key=${ApiService.APIKey}`;
	}

	constructor(private http: Http) {}

	getMovie(id: number): Observable<Movie> {
		const url: string = this.getByIdURL('movie', id);
		return this.http.get(url)
			.map(resp => resp.json())
			.map(ApiToModelMapper.movieFromJson);
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

	searchMediaItems(query: string): Observable<MediaItem[]> {
		const url: string = this.searchURL('multi', query);
		return this.http.get(url)
			.map(this.extractResults)
			.map(results => results.map(ApiToModelMapper.mediaItemFromJson));
	}

	private extractResults(response: Response): any[] {
		return response.json().results as any[];
	}
}
