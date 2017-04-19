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

			case MediaType.Unknown:
				// TODO: handle this case
				break;
		}

		return mediaItem;
	}

  static movieFromJson(json: any): Movie {
		if (json == undefined) { return undefined; }
    const imgBaseUrl_noWidth = "https://image.tmdb.org/t/p";
    const imgBaseUrl = [imgBaseUrl_noWidth, "/w500"].join("");
    const imgBaseUrl_backdrop = [imgBaseUrl_noWidth, "/w1280"].join("");

		var movie = new Movie();
    movie.id = json.id as number;

		movie.title = json.title as string;

    const posterPath = json.poster_path;
    movie.imageUrl = posterPath
      ? `${imgBaseUrl}${json.poster_path}`
      : "http://2.bp.blogspot.com/-NBniP7HEcqw/UJgO7lopaII/AAAAAAAACCs/u5X5wEimHoI/s1600/not-found.png";

    const backdropPath = json.backdrop_path;
    movie.backdropUrl = backdropPath
      ? `${imgBaseUrl_backdrop}${json.backdrop_path}`
      : "http://www.solidbackgrounds.com/images/1920x1080/1920x1080-black-solid-color-background.jpg"

		movie.overview = json.overview as string;

    const collection = json.belongs_to_collection;
    movie.collectionId = collection ? collection.id : null;

    const genres = json.genres as any[];
    movie.genres = genres ? genres.map(genre => genre.name) : [];

    movie.runtime = json.runtime ? json.runtime : null;

    movie.releaseDate = json.release_date ? json.release_date : null;

    const credits = json.credits;
    const cast = credits ? credits.cast as any[] : [];
    cast.forEach(person => {
      const character = person.character as string;
      if (character == null) { return }
      const p = ApiToModelMapper.personFromJson(person);
      movie.castCharacterMap.set(p, character);
    });

    const crew = credits ? credits.crew as any[] : [];
    crew.forEach(person => {
      const job = person.job as string;
      if (job == null) { return }
      const p = ApiToModelMapper.personFromJson(person);
      // ugly hack to remove crew with nu public
      if (p.imageUrl.endsWith("not-found.png")) { return; }
      movie.crewJobMap.set(p, job);
    })

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
