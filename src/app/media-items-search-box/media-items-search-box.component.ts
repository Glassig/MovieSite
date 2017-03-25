import { Component, OnInit } from '@angular/core';

import { ApiService } from '../api.service';
import { MediaItem, MediaType } from '../model/media-item';

import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';

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

  constructor(public apiService: ApiService) { }

  ngOnInit() {
    this.initialiseMediaItems();
  }

  private initialiseMediaItems() {
    this.mediaItems = this.mediaItemsSearchTerms
      .debounceTime(300)
      .distinctUntilChanged()
      .switchMap(term => term
        ? this.apiService.getMediaItems(term)
        : Observable.of<MediaItem[]>([])
      )
      //only display first 8 results
      .map(results => results.slice(0,8))
      // don't show dropdown box if there was no results
      .do(results => { this.boxVisible = results.length > 0; });
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
