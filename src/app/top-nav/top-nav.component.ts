import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.css']
})
export class TopNavComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  @Output() toggleEvent: EventEmitter<string> = new EventEmitter<string>();

  sendToggle(): void {
  	console.log("child sends message");
  	this.toggleEvent.emit("message");
  }
}
