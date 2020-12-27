import {AfterViewInit, ChangeDetectorRef, Component, EventEmitter, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTable, MatTableDataSource} from '@angular/material/table';

import {Bundle, Patient} from 'fhir-stu3';
import {ActivatedRoute, Router} from '@angular/router';
import {FhirService} from '../service/fhir.service';
import {MatSort} from '@angular/material/sort';

export interface PeriodicElement {
  name: string;
  mail: string;
  vname: string;
  linked: boolean;
}

const PATIENT_DATA: Patient[] = [];

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit,AfterViewInit  {
  // displayedColumns: string[] = ['mail', 'name', 'vname', 'linked', 'actions'];
  @ViewChild('table') table: MatTable<Patient>;
  displayedColumns: string[] = ['vname', 'name', 'actions'];
  dataSource = new MatTableDataSource<Patient>(PATIENT_DATA);

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(private fhirService: FhirService,
              private router: Router,
              private cdr:ChangeDetectorRef,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.getData();
    this.dataSource.sort = this.sort;
    this.cdr.detectChanges();


  }


  getData() {
    this.route.queryParams.subscribe(params => {
      if (params.patients === 'new') {
        this.fhirService.getAllPatients(params.given, params.family, params.email)
          .subscribe((response: Bundle) => {
            const dataSource = new MatTableDataSource();
            response.entry.forEach((patient) => {
              dataSource.data.unshift(patient.resource as Patient);
            });
            this.dataSource = dataSource;
          });
      }
    });
  }

  showDetails(id) {
    this.router.navigate(['/patient/' + id]);
  }

  public doFilter = (value: string) => {
    let PATIENT_DATA: Patient[] = [];
    PATIENT_DATA = this.dataSource.data;
    PATIENT_DATA = PATIENT_DATA.filter(patient => patient.name[0].family.includes(value.trim()));
    console.log(PATIENT_DATA);
    this.dataSource.data = PATIENT_DATA;
    console.log(this.dataSource.data);

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
