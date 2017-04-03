import { Component, OnInit, Input } from '@angular/core';
import {AF} from "../providers/af";
import {AngularFire, AuthProviders, AuthMethods, FirebaseListObservable} from 'angularfire2';


import { Review } from "../model/review"
import{ Movie } from "../model/movie"

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
    @Input() movie: Movie;
    movie_id: number;
    review: Review;
    rating: number;
    reviews: FirebaseListObservable<any>;


    constructor(public afService: AF, public af: AngularFire){}

    ngOnInit(){



        this.reviews = this.afService.testQuery(this.movie);

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
