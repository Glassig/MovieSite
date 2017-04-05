import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { MaterialModule } from '@angular/material';
import 'hammerjs';

import { AppComponent } from './app.component';
import { SearchMovieComponent } from './search-movie/search-movie.component';

import { ApiService } from './api/api.service';
import { SideNavComponent } from './side-nav/side-nav.component';

import { MediaItemsSearchBoxComponent } from './media-items-search-box/media-items-search-box.component';

import { AngularFireModule } from 'angularfire2';
import { YoutubePlayerModule } from 'ng2-youtube-player';
import { DragulaModule } from 'ng2-dragula';

import { AF } from './providers/af';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { TopNavComponent } from './top-nav/top-nav.component';
import { MovieDetailComponent } from './movie-detail/movie-detail.component';
import { ActorDetailComponent } from './actor-detail/actor-detail.component';
import { CreateReviewComponent } from './create-review/create-review.component';
import { MovieCardComponent } from './movie-card/movie-card.component';
import { ReviewCardComponent } from './review-card/review-card.component';

  export const firebaseConfig = {
    apiKey: "AIzaSyDlEV2M2O1fwIwJnS7ZDNrLUb6KvoQ5ov4",
    authDomain: "movie-site-1c2d5.firebaseapp.com",
    databaseURL: "https://movie-site-1c2d5.firebaseio.com",
    storageBucket: "movie-site-1c2d5.appspot.com",
    messagingSenderId: "835423026443"
  };

@NgModule({
  declarations: [
    AppComponent,
    SearchMovieComponent,
    SideNavComponent,
    MediaItemsSearchBoxComponent,
    MyProfileComponent,
    TopNavComponent,
    MovieDetailComponent,
    ActorDetailComponent,
    CreateReviewComponent,
    MovieCardComponent,
    ReviewCardComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule,
    AppRoutingModule,
    FlexLayoutModule,
    YoutubePlayerModule,
    DragulaModule,
    AngularFireModule.initializeApp(firebaseConfig),
  ],
  providers: [
    ApiService,
    AF,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
