import { Movie } from './movie';
export class User {
  id: string;
  name: string;
  imageUrl: string;
  email: string;
  watchlist: Movie[];
  key: string;
}