import { Component, OnInit } from '@angular/core';

import { ApiService } from '../api/api.service';
import { MediaItem, MediaType } from '../model/media-item';

import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';

import { RouterModule, Routes, Router } from '@angular/router';

// Observable class extensions
import 'rxjs/add/observable/of';

// Observable operators
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';

@Component({
  selector: 'media-items-search-box',
  templateUrl: './media-items-search-box.component.html',
  styleUrls: ['./media-items-search-box.component.css']
})
export class MediaItemsSearchBoxComponent implements OnInit {
  private mediaItemsSearchTerms = new Subject<string>();
  mediaItems: Observable<MediaItem[]>;
  boxVisible: boolean = false;

  constructor(public apiService: ApiService, private router: Router) { }

  ngOnInit() {
    this.initialiseMediaItems();
  }

  private initialiseMediaItems() {
    this.mediaItems = this.mediaItemsSearchTerms
      .debounceTime(300)
      .distinctUntilChanged()
      .switchMap(term => term
        ? this.apiService.searchMediaItems(term)
        : Observable.of<MediaItem[]>([])
      )
      //only display first 8 results
      .map(results => results.slice(0,8))
      // don't show dropdown box if there was no results
      .do(results => { this.boxVisible = results.length > 0; });
  }

  mediaInfo(media: MediaItem) {
    switch(media.mediaType) {
      case MediaType.Movie: this.router.navigate(['/movie', media.id]);
                  break;
      case MediaType.Person: break;
      case MediaType.TVShow: break;
      case MediaType.Unknown: console.log("Unable to acces page");
    }
  }

  searchMediaItems(query: string) { this.mediaItemsSearchTerms.next(query); }

  setBoxVisibility(visible: boolean) { this.boxVisible = visible; }

  mediaTypeString(mediaType: MediaType): string {
    switch (mediaType) {
      case MediaType.Movie: return "Movie";
      case MediaType.Person: return "Person";
      case MediaType.TVShow: return "TV-show";
      case MediaType.Unknown: return "Unknown";
    }
  }

}
