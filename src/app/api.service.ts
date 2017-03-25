import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Movie } from './model/movie';
import { Person } from './model/person';
import { MediaItem, MediaType, mediaTypeFromString } from './model/media-item';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class ApiService {
	private static APIKey: string = "99d34030725aed23c5f81fe23241d83e";
	private static imageBaseURL: string = "https://image.tmdb.org/t/p/w500";

	private searchURL(type: string, query: string): string {
		return `https://api.themoviedb.org/3/search/${type}?api_key=${ApiService.APIKey}&query=${query}`;
	}

	constructor (private http: Http) {}

	getMovies(query: string): Observable<Movie[]> {
		const url: string = this.searchURL('movie', query);
		return this.http.get(url)
			.map(this.extractResults)
			.map(results => results.map(this.movieFromJson));
	}

	getPeople(query: string): Observable<Person[]> {
		const url: string = this.searchURL('person', query);
		return this.http.get(url)
			.map(this.extractResults)
			.map(results => results.map(this.personFromJson));
	}

	getMediaItems(query: string): Observable<MediaItem[]> {
		const url: string = this.searchURL('multi', query);
		return this.http.get(url)
			.map(this.extractResults)
			.map(results => results.map(this.mediaItemFromJson));
	}

	private extractResults(response: Response): any[] {
		return response.json().results as any[];
	}

	movieFromJson(json: any): Movie {
		if (json == undefined) { return undefined; }

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
		if (json == undefined) { return undefined; }

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

	mediaItemFromJson(json: any): MediaItem {
		if (json == undefined) { return undefined; }

		var mediaItem = new MediaItem();
		mediaItem.id = json.id as number;
		mediaItem.mediaType = mediaTypeFromString(json.media_type);

		const imgBaseUrl = "https://image.tmdb.org/t/p/w92";

		switch (mediaItem.mediaType) {
			case MediaType.Movie:
				mediaItem.imageUrl = `${imgBaseUrl}${json.poster_path}`;
				mediaItem.title = json.title as string;
				break;
			case MediaType.Person:
				mediaItem.imageUrl = `${imgBaseUrl}${json.profile_path}`;
				mediaItem.title = json.name as string;
				const knownFor = json.known_for as any[];
				break;
			case MediaType.TVShow:
				mediaItem.imageUrl = `${imgBaseUrl}${json.poster_path}`;
				mediaItem.title = json.name as string;
				break;
			case MediaType.Unknown:
				// TODO: handle this case
				break;
		}

		return mediaItem;
	}
}
