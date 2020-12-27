import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {Patient} from 'fhir-stu3';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private patientSearchParameters = new Subject<{firstName: string, lastName: string, email: string, patients: string}>();
  constructor() { }

  getPatientSearchParameters() {
    return this.patientSearchParameters.asObservable();
  }

  updatePatientSearchParameters(firstName: string, lastName: string, email: string, patients: string){
    this.patientSearchParameters.next({firstName, lastName, email, patients});
  }
}
