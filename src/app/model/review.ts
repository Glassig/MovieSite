import { Movie } from "../model/movie.ts"
export class Review{
    user_id: string;
    movie: Movie;
    text: string;
    rating: number ;
}
