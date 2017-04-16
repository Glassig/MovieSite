import { Component, OnInit, Input } from '@angular/core';
import { Review } from "../model/review"
import{ Movie } from "../model/movie"
import { AF } from '../providers/af';

@Component({
  selector: 'review-card',
  templateUrl: './review-card.component.html',
  styleUrls: ['./review-card.component.css']
})
export class ReviewCardComponent implements OnInit {
    @Input() review: Review;
    private url;
    private stars;
  constructor(public afService: AF) { }

  ngOnInit() {
      // Finds the url for the user picture.
     this.url = this.afService.findUserPhoto(this.review.user_id).subscribe(snapshots=>{
         snapshots.forEach(snapshot=>{
             this.url = snapshot.val().imageUrl
         })
     });
     let list : number[] = [];
     for (let i = 0; i < this.review.rating; ++i) {
        list[i]= i;
     }
     this.stars = list;
    // console.log(this.url);
  }

}
