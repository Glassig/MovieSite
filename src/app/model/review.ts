import { Movie } from "../model/movie"
export class Review{
    user_id: string;
    movie: Movie;
    movie_id: number;  // Untill i figure out a better solution
    text: string;
    rating: number;
}
