import { Component, ViewChild } from '@angular/core';
import { AF } from "./providers/af";
import { Router } from "@angular/router";
import { MdSidenav } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'MovieSite!';
  @ViewChild('sidenav') public sidenav: MdSidenav;

  constructor(public afService: AF, private router: Router) {
  }
  
  toggleNav(message: string): void {
    console.log("adult gets: ", message);
    this.sidenav.toggle();
  }
}
