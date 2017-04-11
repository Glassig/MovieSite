import { Component, OnInit, Input } from '@angular/core';
import { Person } from '../model/person';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'person-card',
  templateUrl: './person-card.component.html',
  styleUrls: ['./person-card.component.css']
})
export class PersonCardComponent implements OnInit {
	@Input() person: Person;

  constructor(private router: Router) { }

  ngOnInit() {
  }

	navigateToPersonDetail() {
		this.router.navigate(['/actor', this.person.id]);
	}
}
