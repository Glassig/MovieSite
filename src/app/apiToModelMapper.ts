import { MediaItem, MediaType, mediaTypeFromString, yearStringFromDateString } from './model/media-item';
import { Movie } from './model/movie';
import { Person } from './model/person';

export class ApiToModelMapper {
  static mediaItemFromJson(json: any): MediaItem {
		if (json == undefined) { return undefined; }

		var mediaItem = new MediaItem();
		mediaItem.id = json.id as number;
		mediaItem.mediaType = mediaTypeFromString(json.media_type);

		const imgBaseUrl = "https://image.tmdb.org/t/p/w92";

		switch (mediaItem.mediaType) {
			case MediaType.Movie:
				mediaItem.imageUrl = `${imgBaseUrl}${json.poster_path}`;
				mediaItem.title = `${json.title} (${yearStringFromDateString(json.release_date)})`;
				mediaItem.subtitle = json.overview as string;
				break;
			case MediaType.Person:
				mediaItem.imageUrl = `${imgBaseUrl}${json.profile_path}`;
				mediaItem.title = json.name as string;
				const knownFor = json.known_for as any[];
				mediaItem.subtitle = knownFor
          .map(ApiToModelMapper.mediaItemFromJson)
					.map(media => media.title)
					.reduce((acc,t) => `${acc}, ${t}`);
				break;
			case MediaType.TVShow:
				mediaItem.imageUrl = `${imgBaseUrl}${json.poster_path}`;
				mediaItem.title = `${json.name} (${yearStringFromDateString(json.first_air_date)})`;
				mediaItem.subtitle = json.overview as string;
				break;
			case MediaType.Unknown:
				// TODO: handle this case
				break;
		}

		return mediaItem;
	}

  static movieFromJson(json: any): Movie {
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

	static personFromJson(json: any): Person {
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
}
