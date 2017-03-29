import { Component, OnInit } from '@angular/core';

import { ApiService } from '../api/api.service';
import { MediaItem, MediaType } from '../model/media-item';

import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

// Observable class extensions
import 'rxjs/add/observable/of';

// Observable operators
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/sample';
import 'rxjs/add/operator/withLatestFrom';
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
  boxVisible: Observable<boolean>;

  private arrowClicks = new Subject<"up"|"down"|number>();
  selectedIndex: Observable<number|null>;
  selectedItem: Observable<MediaItem|null>;

  enterPresses = new Subject<void>();

  visibleToggles = new Subject<boolean>();

  hovers = new Subject<number>();

  constructor(public apiService: ApiService) { }

  ngOnInit() {
    this.initialiseMediaItems();
    this.initialiseSelectedIndex();
    this.initialiseSelectedItem();
    this.initialiseBoxVisible();
    this.setUpEnterPressSubscription();
  }

  // Observable initialisations

  private initialiseMediaItems() {
    this.mediaItems = this.mediaItemsSearchTerms
      .debounceTime(300)
      .distinctUntilChanged()
      .map(term => term.trim())
      // don't make an API request if search term is empty
      .switchMap(term => term
        ? this.apiService.searchMediaItems(term)
        : Observable.of<MediaItem[]>([])
      )
      //only display first 8 results
      .map(results => results.slice(0,8))
      // each subscriber shouldn't make a new API request
      .share();
  }

  private initialiseSelectedIndex() {
    this.selectedIndex = Observable.merge(
      this.arrowClicks,
      this.mediaItems.mapTo("top"),
      this.hovers.distinctUntilChanged()
    )
      // don't navigate superfast when holding arrow button
      .sampleTime(50)
      .withLatestFrom(this.mediaItems.map(items => items.length), (move,n) => [move,n])
      .scan((acc: number, curr: ["up"|"down"|"top"|number,number]) => {
        const move = curr[0];
        const n = curr[1];
        if (n == 0) { return null; }
        if (typeof move == "number") { return move }
        switch (curr[0]) {
          case "up": return (acc != null) ? (acc > 0 ? acc-1 : null) : null;
          case "down": return (acc != null) ? Math.min(acc+1, n-1) : 0;
          case "top": return 0;
        }
      }, 0)
      .share()
      .publishReplay(1).refCount();
  }

  private initialiseSelectedItem() {
    this.selectedItem = this.selectedIndex
      .withLatestFrom(this.mediaItems, (i,items) => (i!=null) ? items[i] : null)
      .share();
  }

  private initialiseBoxVisible() {
    const itemsNotEmpty = this.mediaItems.map(items => items.length > 0);
    // delay clicks outside box (to be able to click on a result row)
    const trueValues = this.visibleToggles.filter(b => b);
    const falseValues = this.visibleToggles.filter(b => !b).delay(200);
    this.boxVisible = Observable.merge(itemsNotEmpty, Observable.merge(trueValues, falseValues))
      .startWith(false)
      .publishReplay(1).refCount();
  }

  private setUpEnterPressSubscription() {
    this.enterPresses.withLatestFrom(this.selectedItem, (_,item) => item)
      .filter(item => item!=null)
      .subscribe(item => {
        // THIS is where we should navigate to the detail screen for the selected item
        this.navigateToItemDetailScreen(item);
      });
  }

  navigateToItemDetailScreen(mediaItem: MediaItem) {
    //TODO: implement the navigation
    console.log(`I want to navigate to the detail page for ${mediaItem.title}`);
  }

  // Functions called from html

  move(direction: "up"|"down"|number) { this.arrowClicks.next(direction); }

  enter() { this.enterPresses.next(); }

  over(index: number) { this.hovers.next(index); }

  searchMediaItems(query: string) { this.mediaItemsSearchTerms.next(query); }

  setBoxVisibility(visible: boolean) { this.visibleToggles.next(visible); }
}
