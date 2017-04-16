import { Movie } from "../model/movie"
import { User } from "../model/user";
export class Review{
	user: User;
	user_id;
    movie: Movie;
    movie_id;
    text: string;
    rating: number;
}
