import { Injectable } from '@angular/core';
import * as nativeFhir from 'fhir.js/src/adapters/native';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {
  AllergyIntolerance,
  Condition,
  Medication,
  MedicationStatement,
  Observation,
  Patient
} from 'fhir-stu3';

@Injectable({
  providedIn: 'root'
})
export class FhirService {
  fhir = nativeFhir({
    baseUrl: 'http://localhost:8080/hapi-fhir-jpaserver/fhir',
  });

  constructor(private httpClient: HttpClient) {
  }

  getPatients(firstName: string, lastName: string, email: string, patients: string){
    if (patients === 'new') {
      return this.getAllPatients(firstName, lastName, email);
    } else {
     return this.getPatientsByPractitionerId(firstName, lastName, email);
    }
  }

  getAllPatients(firstName: string, lastName: string, email: string) {
    const fn = firstName === undefined ? '' : firstName;
    const ln = lastName === undefined ? '' : lastName;
    const em = email === undefined ? '' : email;


    return this.httpClient.get('http://localhost:8080/hapi-fhir-jpaserver/fhir/Patient?given=' + fn + '&family=' + ln);
  }

  getPatientsByPractitionerId(firstName: string, lastName: string, email: string){
  }

  getPatientById(patientId: string){
    return this.httpClient.get('http://localhost:8080/hapi-fhir-jpaserver/fhir/Patient/' + patientId);
  }

  getObservationsByPatientId(patientId: string){
    return this.httpClient.get('http://localhost:8080/hapi-fhir-jpaserver/fhir/Observation?patient=' + patientId);
  }

  getConditionsByPatientId(patientId: string){
    return this.httpClient.get('http://localhost:8080/hapi-fhir-jpaserver/fhir/Condition?patient=' + patientId);
  }

  getAllergiesByPatientId(patientId: string){
    return this.httpClient.get('http://localhost:8080/hapi-fhir-jpaserver/fhir/AllergyIntolerance?patient=' + patientId);
  }

  getMedicationStatementsByPatientId(patientId: string){
    return this.httpClient.get('http://localhost:8080/hapi-fhir-jpaserver/fhir/MedicationStatement?patient=' + patientId);
  }

  getMedicationById(medId: string){
    return this.httpClient.get('http://localhost:8080/hapi-fhir-jpaserver/fhir/' + medId);
  }

  getDocumentReferencesByPatientId(patientId: string){
    return this.httpClient.get('http://localhost:8080/hapi-fhir-jpaserver/fhir/DocumentReference?patient=' + patientId);
  }

  putObservation(obs: Observation){
    return this.httpClient.put('http://localhost:8080/hapi-fhir-jpaserver/fhir/Observation/' + obs.id, obs);
  }

  putPatient(patient: Patient){
    return this.httpClient.put('http://localhost:8080/hapi-fhir-jpaserver/fhir/Patient/' + patient.id, patient);
  }

  updateAllergy(allergy: AllergyIntolerance){
    return this.httpClient.put('http://localhost:8080/hapi-fhir-jpaserver/fhir/AllergyIntolerance/' + allergy.id,
      allergy);
  }

  updateCondition(condition: Condition){
    return this.httpClient.put('http://localhost:8080/hapi-fhir-jpaserver/fhir/Condition/' + condition.id,
      condition);
  }

  putMedication(med: Medication){
    return this.httpClient.put('http://localhost:8080/hapi-fhir-jpaserver/fhir/Medication/' + med.id,
      med);
  }

  putMedicationStatement(statement: MedicationStatement){
    return this.httpClient.put('http://localhost:8080/hapi-fhir-jpaserver/fhir/MedicationStatement/' + statement.id,
      statement);
  }
}
