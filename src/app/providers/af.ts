import {Injectable} from "@angular/core";
import {AngularFire, AuthProviders, AuthMethods, FirebaseListObservable} from 'angularfire2';
import { User } from '../model/user';
import { Movie } from '../model/movie';
import { Review } from '../model/review';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Subscription } from "rxjs";

@Injectable()
export class AF {

  isLoggedIn: boolean = false;
  public user: User;
  reviews: FirebaseListObservable<any>;
  users: FirebaseListObservable<any>;
  userSubscription: Subscription;
  watchlistSubscription: Subscription;
  reviewlistSubscription: Subscription;

  constructor(public af: AngularFire) {
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
    imageUrl: "http://www.hollywoodreporter.com/sites/default/files/custom/Blog_Images/interstellar3.jpg",
    backdropUrl: "https://blogs-images.forbes.com/simonthompson/files/2016/11/fantastic-beasts-movie-posters-clips-1200x600.jpg?width=960",
    overview: "best movie",
    collectionId: null,
    // maybe make genre an enum in future
    genres: [],
    runtime: 140,
    releaseDate: "2014-01-01"
  }


//Returns the profile picture from a certain user
//*user_id : The id of the selected user.
  findUserPhoto(userid){
      //console.log("Enter find photo");
      //console.log(userid);
      const selUser = this.af.database.list("users",{
          preserveSnapshot: true,
          query: {
              orderByChild: "id",
              equalTo: userid
          }
      })
      return selUser



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

    console.log("query done");
     return query;
 }


// Finds all reviews regarding a certain movie.
// TODO fult med movie_id i review
 testQuery(movieid: number) {
     const array = []
     console.log("Test query");
     //console.log(movie.id);

     const query = this.af.database.list("reviews",{
     preserveSnapshot: true,
     query:{
         orderByChild: "movie_id",
         equalTo: movieid
        }
    }).subscribe(snapshots=>{
        snapshots.forEach(snapshot=>{
            array.push(snapshot.val());
        })
    });
    //console.log("query done");
     return array;
 }

  addReview(review: Review){
      //console.log("Enter AF addreview")
      if (!this.isLoggedIn){ return }
          this.reviews.push(review);
          this.users.update(this.user.key, this.user);
        //  console.log(this.user.name);


  }



  addMovieToWatchlist(movie: Movie) {
    if (!this.isLoggedIn) { return }
    if (!this.movieIsInWatchList(movie)) {
      this.user.watchlist.push(movie);
      this.users.update(this.user.key, this.user);
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
