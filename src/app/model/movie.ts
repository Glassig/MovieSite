export class Movie {
  id: number;
  title: string;
  imageUrl: string;
  overview: string;
  collectionId: number | null;
  // maybe make genre an enum in future
  genres: string[];
  runtime: number | null;
  releaseDate: string | null;
}
