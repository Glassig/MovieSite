import { Component, OnInit, Input } from '@angular/core';
import {AF} from "../providers/af";

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
    review: Review;
    rating: number;

    constructor(public afService: AF){}

    ngOnInit(){

    }
    changeRating(num) {
      this.rating = num;
    }
  addReview(textInput: string) {
      this.review = {
          user_id: this.afService.user.id,
          movie: this.movie,
          text: textInput,
          rating: this.rating
      }
      console.log(this.review);

      this.afService.addReview(this.review);
    }


}
