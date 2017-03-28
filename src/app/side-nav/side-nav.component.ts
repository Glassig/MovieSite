import { Component, OnInit } from '@angular/core';
import { AF } from '../providers/af';
import {AuthProviders} from 'angularfire2';

@Component({
  selector: 'side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit {

  providerFacebook: AuthProviders = AuthProviders.Facebook;
  providerGoogle: AuthProviders = AuthProviders.Google;



  constructor(public afService: AF) { 
  }

  ngOnInit() {
  }
}
