import { MediaItem, MediaType, mediaTypeFromString } from '../model/media-item';
import { Movie } from '../model/movie';
import { Person } from '../model/person';
import { MovieVideo } from '../model/movie-video';

export class ApiToModelMapper {
  static mediaItemFromJson(json: any): MediaItem {
		if (json == undefined) { return undefined; }

		var mediaItem = new MediaItem();
		mediaItem.id = json.id as number;
		mediaItem.mediaType = mediaTypeFromString(json.media_type);

		const imgBaseUrl = "https://image.tmdb.org/t/p/w92";
    const backupPic = "../../assets/img/unknown.png";

		switch (mediaItem.mediaType) {
			case MediaType.Movie:
        const moviePosterPath = json.poster_path;
        mediaItem.imageUrl = moviePosterPath
          ? `${imgBaseUrl}${moviePosterPath}`
          : backupPic;

        const releaseDate = json.release_date;
        mediaItem.title = releaseDate
          ? `${json.title} (${releaseDate.split('-')[0]})`
          : `${json.title}`;

				mediaItem.subtitle = json.overview as string;
				break;

			case MediaType.Person:
        const profilePath = json.profile_path;
        mediaItem.imageUrl = profilePath
          ? `${imgBaseUrl}${profilePath}`
          : backupPic;

				mediaItem.title = json.name as string;

				const knownFor = json.known_for as any[];
        mediaItem.subtitle = knownFor && knownFor.length > 0
          ? knownFor
              .map(ApiToModelMapper.mediaItemFromJson)
  					  .map(media => media.title)
  					  .reduce((acc,t) => `${acc}, ${t}`)
          : "";
				break;

			case MediaType.TVShow:
        const tvPosterPath = json.poster_path;
        mediaItem.imageUrl = tvPosterPath
          ? `${imgBaseUrl}${tvPosterPath}`
          : backupPic;

        const firstAirDate = json.first_air_date;

        mediaItem.title = firstAirDate
          ? `${json.name} (${firstAirDate.split('-')[0]})`
          : `${json.name}`;

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

    const imgBaseUrl = "https://image.tmdb.org/t/p/w500";

		var movie = new Movie();
    movie.id = json.id as number;

		movie.title = json.title as string;

    const posterPath = json.poster_path;
    movie.imageUrl = posterPath
      ? `${imgBaseUrl}${json.poster_path}`
      : "http://2.bp.blogspot.com/-NBniP7HEcqw/UJgO7lopaII/AAAAAAAACCs/u5X5wEimHoI/s1600/not-found.png";

		movie.overview = json.overview as string;

    const collection = json.belongs_to_collection;
    movie.collectionId = collection ? collection.id : null;

    const genres = json.genres as any[];
    movie.genres = genres ? genres.map(genre => genre.name) : [];

    movie.runtime = json.runtime ? json.runtime : null;

    movie.releaseDate = json.release_date ? json.release_date : null;

		return movie;
	}

	static personFromJson(json: any): Person {
		if (json == undefined) { return undefined; }

    const imgBaseUrl = "https://image.tmdb.org/t/p/w500";

		var person = new Person();
    person.id = json.id as number;
		person.name = json.name as string;
		if(json.profile_path == undefined) {
			person.imageUrl = "http://2.bp.blogspot.com/-NBniP7HEcqw/UJgO7lopaII/AAAAAAAACCs/u5X5wEimHoI/s1600/not-found.png"
		} else {
			person.imageUrl = imgBaseUrl + json.profile_path as string;
		}

		return person;
	}

  static movieVideoFromJson(json: any): MovieVideo|null {
    if (json == undefined) { return null; }

    const site = json.site as string;
    // reject the video if it is not hosted by YouTube
    if (site != "YouTube") { return null; }

    var video = new MovieVideo();
    video.id = json.id as string;
    video.key = json.key as string;
    video.name = json.name as string;
    video.type = json.type;

    return video;
  }
}
