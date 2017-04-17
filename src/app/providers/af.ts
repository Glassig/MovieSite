import {Injectable} from "@angular/core";
import { Http, Response } from '@angular/http';

import {AngularFire, AuthProviders, AuthMethods, FirebaseListObservable} from 'angularfire2';
import { User } from '../model/user';
import { Movie } from '../model/movie';
import { Review } from '../model/review';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import { Subscription } from "rxjs";

@Injectable()
export class AF {

  isLoggedIn: boolean = false;
  loadedLists: boolean = false;
  hasReviewed: boolean = false;
  public user: User;
  public loggedInUser = new BehaviorSubject<User|null>(null);
  movieReviews: Review[];
  users: FirebaseListObservable<any>;
  reviews: FirebaseListObservable<any>;
  userSubscription: Subscription;
  reviewlistSubscription: Subscription;

  constructor(public af: AngularFire, private router: Router) {
    this.user = new User();
    this.users = this.af.database.list('users');
    this.reviews = this.af.database.list('reviews');
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
            var list2 = resp[0].favouritelist;
            list == undefined ? this.user.watchlist = [] : this.user.watchlist = list;
            list2 == undefined ? this.user.favouritelist = [] : this.user.favouritelist = list2;
            this.loggedInUser.next(this.user);
            this.loadedLists = true;
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
    this.loggedInUser.next(null);
    this.loadedLists = false;
    this.userSubscription.unsubscribe();
    if(this.reviewlistSubscription != undefined){ 
      this.reviewlistSubscription.unsubscribe();
    }
    this.router.navigate(['/search-movie']);
    return this.af.auth.logout();
  }

//Returns all reviews from a certain user.
// @return FirebaseListObservable,  list containing reviews
 getUserReviews(){
     const query = this.af.database.list("reviews",{
     query:{
         orderByChild: "user_id",
         equalTo: this.user.id
        }
    });
     return query;
 }

// Finds all reviews for a certain movie.
initiateReviewSubscription(movieid: number) {
     this.reviewlistSubscription = 
     this.af.database.list('reviews',{ 
       preserveSnapshot: true, 
       query:{ 
         orderByChild: "movie_id", 
         equalTo: movieid 
       }})
     .subscribe(snapshots => {
        this.movieReviews = [];
        this.hasReviewed = false;
        snapshots.forEach(snapshot => {
          var review = snapshot.val();
          this.movieReviews.push(review);
          if(this.isLoggedIn && review.user_id == this.user.id) { this.hasReviewed = true }
        }) 
    }, 
      error => console.error('Error fetching reviews', error));
 }

  addReview(review: Review){
      if (!this.isLoggedIn || this.hasReviewed){ return }
      this.reviews.push(review);
  }

  removeMovieFromFavouritelist(movie: Movie) {
    if(this.isLoggedIn) {
      this.user.favouritelist = this.user.favouritelist
      .filter(function(resp) {
        return resp.id !== movie.id;
      });
      this.users.update(this.user.key, this.user);
    }
  }

  removeMovieFromList(movie: Movie, array: Movie[]) {
    if(this.isLoggedIn) {
      array = array
      .filter(function(resp) {
        return resp.id !== movie.id;
      });
      this.users.update(this.user.key, this.user);
    }
  }

  addMovieToList(movie: Movie, array: Movie[]) {
    if (!this.isLoggedIn) { return }
    if (!this.movieIsInList(movie, array)) {
      array.push(movie);
      this.users.update(this.user.key, this.user);
    }
  }

  movieIsInList(movie: Movie, array: Movie[]): boolean {
    if(!array) { return false }
    return array.map(movie => movie.id).includes(movie.id);
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

  extractResults(response: Response): any[] {
    return response.json().results as any[];
  }

  updateUser() {
    if (!this.isLoggedIn) { return }
      this.users.update(this.user.key, this.user);
  }
}
