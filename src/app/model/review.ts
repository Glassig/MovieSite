import { Movie } from "../model/movie.ts"
export class Review{
    user_id: string;
    movie: Movie; // Untill i figure out a better solution
    text: string;
    rating: number;
}
