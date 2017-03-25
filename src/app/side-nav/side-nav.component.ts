import { Component, OnInit } from '@angular/core';
import { AF } from '../providers/af';

@Component({
  selector: 'side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit {


  constructor(public afService: AF) { 
  }

  ngOnInit() {
  }

  logout() {
  	this.afService.logout();
  }

}
