export enum MediaType { Movie, TVShow, Person, Unknown }

export function mediaTypeFromString(mediaTypeString: string): MediaType {
  var mediaType = MediaType.Unknown;
  switch (mediaTypeString) {
    case 'movie':
      mediaType = MediaType.Movie;
      break;
    case 'person':
      mediaType = MediaType.Person;
      break;
    case 'tv':
      mediaType = MediaType.TVShow;
      break;
  }
  return mediaType;
}

export function yearStringFromDateString(date: string): string {
	if (date == undefined) return "?";

	return date.split('-')[0];
}

export class MediaItem {
  id: number;
  title: string;
  subtitle: string;
  imageUrl: string;
  mediaType: MediaType;
}
