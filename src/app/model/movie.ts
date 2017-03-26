export class Movie {
  id: number;
  title: string;
  imageUrl: string;
  overview: string;
  collectionId: number | undefined;
  // maybe make genre an enum in future
  genres: string[];
  runtime: string;
  releaseDate: string;
}
