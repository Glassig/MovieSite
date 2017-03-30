import {Injectable} from "@angular/core";
import {AngularFire, AuthProviders, AuthMethods, FirebaseListObservable} from 'angularfire2';
import { User } from '../model/user';
import { Movie } from '../model/movie';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Subscription } from "rxjs";

@Injectable()
export class AF {

  isLoggedIn: boolean = false;
  public user: User;
  users: FirebaseListObservable<any>;
  userSubscription: Subscription;
  watchlistSubscription: Subscription;

  constructor(public af: AngularFire) {
    this.user = new User();
    this.users = this.af.database.list('users');
  }
  /**
   * Logs in the user and adds to the database if it is the first login attempt
   * Retrieves the watchlist from the user
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
      this.initiateUserSubscription();
    }).catch((em) => {
      console.error('Error fetching user', em);
    });
    }

  initiateUserSubscription() {
    var pushed = false;
    this.userSubscription = this.af.database.list('users',
      { query: { orderByChild: 'id', equalTo: this.user.id } })
      .subscribe(resp => {
        if(resp.length == 0 && !pushed) { 
          pushed = true;
          this.users.push(this.user);
        } else {
          if(resp[0] != undefined) {
            this.user.key = resp[0].$key;
            var list = resp[0].watchlist;
            list == undefined ? this.user.watchlist = [] : this.user.watchlist = list;
          }
        }
      },
        error => {
          console.error('Error fetching users from database', error);
        })
  }

  userFromJson(json: any): User {
    var user = new User();
    user.email = json.auth.email;
    user.id = json.auth.uid;
    user.imageUrl = json.auth.photoURL;
    user.name = json.auth.displayName;
    user.watchlist = [];
    return user;
  }
  /**
   * Logs out the current user
   */
  logout() {
    this.isLoggedIn = false;
    this.userSubscription.unsubscribe();
    if(this.watchlistSubscription) { this.watchlistSubscription.unsubscribe() }
    return this.af.auth.logout();
  }

  testMovie: Movie = {
    id: 123,
    title: "interstellar",
    imageUrl: "data:image/jpeg;base64,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",
    overview: "best movie",
    collectionId: null,
    // maybe make genre an enum in future
    genres: [],
    runtime: 140,
    releaseDate: "2014-01-01"
  }

  addMovieToWatchlist(movie: Movie) {
    if(this.isLoggedIn) {
      var exists = false;
      this.user.watchlist.forEach(function(el) {
        if(el.id == movie.id)
          exists = true;
      });
      if(!exists){
        this.user.watchlist.push(movie);
        this.users.update(this.user.key, this.user);
      }
    }
  }

  movieIsInWatchList(movie: Movie): boolean {
    if (!this.isLoggedIn) { return false }
    return this.user.watchlist.map(movie => movie.id).includes(movie.id);
  }

  removeMovieFromWatchlist(movie: Movie) {
    if(this.isLoggedIn) {
      this.user.watchlist = this.user.watchlist
      .filter(function(resp) {
        return resp.id !== movie.id;
      });
      this.users.update(this.user.key, this.user);
    }
  }
}
