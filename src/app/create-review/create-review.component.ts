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

    constructor(public afService: AF){}

    ngOnInit(){

    }
  addReview(textInput: string,ratingInput: number) {
      this.review = {
          user_id: this.afService.user.id,
          movie: this.movie,
          text: textInput,
          rating: ratingInput
      }
      console.log(this.review.rating)

    }


}
