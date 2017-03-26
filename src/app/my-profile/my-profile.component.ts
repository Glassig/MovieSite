import { Component, OnInit } from '@angular/core';
import {AF} from "../providers/af";
import { Router } from '@angular/router';
import { Movie } from '../model/movie';

@Component({
  selector: 'my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {

  constructor(public afService: AF, private router: Router) {}

  ngOnInit() {
  	if(!this.afService.isLoggedIn) {
  		this.router.navigate(['/login']);
  	} else {
  	}
  }

}
