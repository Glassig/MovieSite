import { Component, OnInit } from '@angular/core';
import {AF} from "../providers/af";
import { Router } from '@angular/router';
import { Movie } from '../model/movie';
import { Person } from '../model/person';
import {AngularFire, AuthProviders, AuthMethods, FirebaseListObservable} from 'angularfire2';

@Component({
  selector: 'my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {

  reviews: FirebaseListObservable<any>;

  constructor(public afService: AF, private router: Router) {}

  ngOnInit() {
  	if(!this.afService.isLoggedIn) {
  		this.router.navigate(['/search-movie']);
        this.reviews = null;
  	} else {
      this.reviews = this.afService.getUserReviews();
  	}
  }

  navigateToMovieDetailScreen(movie: Movie) {
    this.router.navigate(['/movie', movie.id]);
  }

}
