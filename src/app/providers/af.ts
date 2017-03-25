import {Injectable} from "@angular/core";
import {AngularFire, AuthProviders, AuthMethods, FirebaseListObservable} from 'angularfire2';
import { User } from '../model/user';
import { Movie } from '../model/movie';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class AF {

  public watchlist: FirebaseListObservable<any>;
  isLoggedIn: boolean = false;
  public user: User;
  users: FirebaseListObservable<any>;

  constructor(public af: AngularFire) {
    this.user = new User();
    this.watchlist = this.af.database.list('watchlist');
    this.users = this.af.database.list('users');
  }
  /**
   * Logs in the user
   * @returns {firebase.Promise<FirebaseAuthState>}
   */

  login(provider: AuthProviders) {
    return this.af.auth.login({
      provider: provider,
      method: AuthMethods.Popup,
    })
    .then((data) => {
      this.user = this.userFromJson(data);
      this.isLoggedIn = true;
      var add = true;
      this.users
      .subscribe(resp => {
        resp.forEach(user => {
          if(user.id == this.user.id) { add = false }
        });
        if(add) {
          this.users.push(this.user);
        }
      })


    });
    }

  userFromJson(json: any): User {
    var user = new User();
    user.email = json.auth.email;
    user.id = json.auth.uid;
    user.imageUrl = json.auth.photoURL;
    user.name = json.auth.displayName;
    return user;
  }
  /**
   * Logs out the current user
   */
  logout() {
    this.isLoggedIn = false;
    this.user = new User();
    return this.af.auth.logout();
  }

  addMovieToWatchlist(movie: Movie) {
    var watchListMovie = {
      id: movie.id,
      uid: this.user.id,
      imageUrl: movie.imageUrl,
      title: movie.title,
      overview: movie.overview
    }
    this.watchlist.push(watchListMovie);
  }
}