import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  searchParameters = {
    given: null,
    family: null,
    email: null,
    patients: 'new'
  };

  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }

  searchPatients() {
    this.router.navigate(['/search-results'], {
      queryParams: {
        given: this.searchParameters.given,
        family: this.searchParameters.family,
        email: this.searchParameters.email,
        patients: this.searchParameters.patients
      }
    });
  }

}
