import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AF } from '../providers/af';
import {AuthProviders} from 'angularfire2';

@Component({
  selector: 'top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.css']
})
export class TopNavComponent implements OnInit {

  providerFacebook: AuthProviders = AuthProviders.Facebook;
  providerGoogle: AuthProviders = AuthProviders.Google;

  constructor(public afService: AF) { }

  ngOnInit() {
  }
  @Output() toggleEvent: EventEmitter<string> = new EventEmitter<string>();

  sendToggle(): void {
  	console.log("child sends message");
  	this.toggleEvent.emit("message");
  }
}
