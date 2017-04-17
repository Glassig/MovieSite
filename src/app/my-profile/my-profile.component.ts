import { Component, OnInit, OnChanges } from '@angular/core';
import {AF} from "../providers/af";
import { Router } from '@angular/router';
import { Movie } from '../model/movie';
import { Person } from '../model/person';
import {AngularFire, AuthProviders, AuthMethods, FirebaseListObservable} from 'angularfire2';
import { DragulaService } from 'ng2-dragula/ng2-dragula';

@Component({
  selector: 'my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {

  reviews: FirebaseListObservable<any>;

  constructor(public afService: AF, private router: Router, private dragulaService: DragulaService) { 
    dragulaService.dropModel.subscribe((value) => {
      this.onDropModel(value);
    });
  }

  ngOnInit() {
  	if(!this.afService.isLoggedIn) {
  		this.router.navigate(['/search-movie']);
        this.reviews = null;
  	} else {
      this.reviews = this.afService.getUserReviews();
  	}
  } 

  private onDropModel(args) {
    let [el, target, source] = args;
    this.afService.updateUser();
  }

  navigateToMovieDetailScreen(movie: Movie) {
    this.router.navigate(['/movie', movie.id]);
  }

}
