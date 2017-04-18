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
  options: any = {
    removeOnSpill: true
  }

  constructor(public afService: AF, private router: Router, private dragulaService: DragulaService) { 
    dragulaService.dropModel.subscribe((value) => {
      this.updateModel();
    });
    dragulaService.removeModel.subscribe((value) => {
      this.updateModel();
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

  private updateModel() {
    this.afService.updateUser();
  }

  navigateToMovieDetailScreen(movie: Movie) {
    this.router.navigate(['/movie', movie.id]);
  }

}
