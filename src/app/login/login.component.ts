import { Component, OnInit } from '@angular/core';
import { User } from '../model/user';
import {AF} from "../providers/af";
import {Router} from "@angular/router";
import {AuthProviders} from 'angularfire2';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

	providerFacebook: AuthProviders = AuthProviders.Facebook;
	providerGoogle: AuthProviders = AuthProviders.Google;

  constructor(public afService: AF, private router: Router) { 
  }

  ngOnInit() {}

  login(provider: AuthProviders) {
  	this.afService.login(provider);
  }
}
