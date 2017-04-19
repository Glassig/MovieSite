export enum MediaType { Movie, Person, Unknown }

export function mediaTypeFromString(mediaTypeString: string): MediaType {
  var mediaType = MediaType.Unknown;
  switch (mediaTypeString) {
    case 'movie':
      mediaType = MediaType.Movie;
      break;
    case 'person':
      mediaType = MediaType.Person;
      break;
  }
  return mediaType;
}

export class MediaItem {
  id: number;
  title: string;
  subtitle: string;
  imageUrl: string;
  mediaType: MediaType;
}
