import { Movie } from './movie';
import { Review } from './review'
export class User {
  id: string;
  name: string;
  imageUrl: string;
  email: string;
  reviewlist: Review[];
  watchlist: Movie[];
  favouritelist: Movie[];
  key: string;
}
