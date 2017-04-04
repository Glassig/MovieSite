import { Component, OnInit, Input } from '@angular/core';
import {AF} from "../providers/af";
import {AngularFire, AuthProviders, AuthMethods, FirebaseListObservable} from 'angularfire2';


import { Review } from "../model/review"
import{ Movie } from "../model/movie"
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Observable } from 'rxjs/Rx';
import { Subscription } from "rxjs";
import 'rxjs/Rx';
import 'rxjs/add/operator/switchMap';
/*
    TODO
Firebase for reviews
Reviewlist for user
Reviewlist for movie / show reviews for movie
Styling and stars
*/

@Component({
  selector: 'create-review',
  templateUrl: './create-review.component.html',
  styleUrls: ['./create-review.component.css']
})
export class CreateReviewComponent implements OnInit {
    @Input() private movie: Movie;
    private review: Review;
    private rating: number;
    private reviews: Review[];

    constructor(public afService: AF, public af: AngularFire, private route: ActivatedRoute,){}

    ngOnChanges(){
        this.reviews = [];
        this.reviews = this.afService.testQuery(this.movie.id);
    }

    ngOnInit(){






        this.reviews = this.afService.testQuery(this.movie.id);
        //    this.reviews = array;
        //});
        //const movie = this.route.params
        //.switchMap((params: Params) => this.reviews = this.afService.testQuery(+params['id']));


        console.log(this.reviews);
        //this.movie.switchMap(movie=>this.afService.testQuery(movie.id)).subscribe(reviews=> this.reviews=reviews);


    }

    changeRating(num) {
      this.rating = num;
    }

    addReview(textInput: string) {
        console.log(this.movie);
      if(typeof this.rating === 'undefined'){
          this.rating = 0;
      }
      if (typeof textInput === 'undefined'){
          textInput = "";
      }


      this.review = {
          user_id: this.afService.user.id,
          movie: this.movie,
          movie_id: this.movie.id,
          text: textInput,
          rating: this.rating
      }
      console.log(this.review);

      this.afService.addReview(this.review);
    }


}
