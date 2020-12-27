import {Component, NgZone, OnInit, Inject} from '@angular/core';
import {MessageService} from '../service/message.service';
import {
  AllergyIntolerance,
  Bundle, Coding,
  Condition,
  DocumentReference,
  Medication,
  MedicationStatement,
  Observation,
  Patient
} from 'fhir-stu3';
import {FhirService} from '../service/fhir.service';
import {Router} from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {strict} from "assert";

export interface BodyDialogData {
  height: string;
  weight: string;
  bloodType: string;
}

export interface EmergencyContactDialogData {
  given: string;
  family: string;
  telephone: string;
}

export interface EditAllergyDialogData {
  text: string;
  severity: string;
  manifestation: string;
  severityScale: string[];
}

export interface EditConditionDialogData {
  text: string;
}

export interface EditMedicationDialogData {
  medicationName: string;
  dosage: string;
}

@Component({
  selector: 'app-patient-data-sheet',
  templateUrl: './patient-data-sheet.component.html',
  styleUrls: ['./patient-data-sheet.component.css']
})
export class PatientDataSheetComponent implements OnInit {
  patient: Patient = {name: [{given: ['Vorname'], family: 'Nachname'}], birthDate: '1970-08-03',
                      contact: [ {name: {given: ['Vorname'], family: 'Nachname'},
                      telecom: [{ system: 'phone', value: '' }]} ] };
  height: Observation = {status: '', code: {}, valueQuantity: {value: 0, unit: ''}};
  weight: Observation = {status: '', code: {}, valueQuantity: {value: 0, unit: ''}};
  bloodType: Observation = {status: '', code: {}, valueCodeableConcept: {text: ''}};
  conditions: Condition[] = [];
  allergies: AllergyIntolerance[] = [];
  medications: {statement: MedicationStatement, medication: Medication}[] = [];
  documents: DocumentReference[] = [];

  constructor(private messageService: MessageService,
              private ngZone: NgZone,
              private fhirService: FhirService,
              private router: Router,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getPatient();
    this.getObservations();
    this.getConditions();
    this.getAllergies();
    this.getMedication();
    this.getDocumentReferences();
  }

  getPatient(){
    this.fhirService.getPatientById(this.router.url.split('/')[2])
      .subscribe((response) => {
        this.patient = response;
      });
  }

  getObservations(){
    this.fhirService.getObservationsByPatientId(this.router.url.split('/')[2])
      .subscribe((response: Bundle) => {
        response.entry.forEach((element) => this.handleObservation(element.resource as Observation));
      });
  }

  handleObservation(obs: Observation){
    const coding = obs.code.coding[0] as Coding;
    const code = coding.code;
    if (code === '8302-2'){
      this.height = obs;
    } else if (code === '29463-7'){
      this.weight = obs;
    } else if (code === '883-9'){
      this.bloodType = obs;
    }
  }

  getConditions(){
    this.fhirService.getConditionsByPatientId(this.router.url.split('/')[2])
      .subscribe((response: Bundle) => {
        this.conditions = [];
       response.entry.forEach((condition) => {
         this.conditions.push(condition.resource as Condition);
       });
    });
  }

  getAllergies(){
    this.fhirService.getAllergiesByPatientId(this.router.url.split('/')[2])
      .subscribe((response: Bundle) => {
        this.allergies = [];
        response.entry.forEach((allergy) => {
          this.allergies.push(allergy.resource as AllergyIntolerance);
        });
      });
  }

  getMedication(){
    this.fhirService.getMedicationStatementsByPatientId(this.router.url.split('/')[2])
      .subscribe((response: Bundle) => {
        this.medications = [];
        response.entry.forEach((element) => {
          const statement = element.resource as MedicationStatement;
          this.fhirService.getMedicationById(statement.medicationReference.reference)
            .subscribe((medication: Medication) => {
              const newMedEntry = {statement, medication};
              this.medications.push(newMedEntry);
            });
        });
      });
  }

  getDocumentReferences(){
    this.fhirService.getDocumentReferencesByPatientId(this.router.url.split('/')[2])
      .subscribe((response: Bundle) => {
        response.entry.forEach((element) => {
          this.documents.push(element.resource as DocumentReference);
        });
      });
  }

  calculateAge(birthDate){
    const today = new Date();
    const birthD = new Date(birthDate);
    let age = today.getFullYear() - birthD.getFullYear();
    const m = today.getMonth() - birthD.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthD.getDate())) {
      age--;
    }
    return age;
  }

  openBodyDataDialog(): void{
    const dialogRef = this.dialog.open(PatientBodyDataDialog, {
      width: '250px',
      data: {height: this.height.valueQuantity.value, weight: this.weight.valueQuantity.value,
        bloodType: this.bloodType.code.text}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.height.valueQuantity.value = result.height;
        this.weight.valueQuantity.value = result.weight;
        this.bloodType.code.text = result.bloodType;
        this.fhirService.putObservation(this.height)
          .subscribe((response: Observation) => {
            this.height = response;
          });
        this.fhirService.putObservation(this.weight)
          .subscribe((response: Observation) => {
            this.weight = response;
          });
        this.fhirService.putObservation(this.bloodType)
          .subscribe((response: Observation) => {
            this.bloodType = response;
          });
      }
    });
  }

  openEditEmergencyContactDialog(): void{
    const dialogRef = this.dialog.open(PatientEditEmergencyContactDialog, {
      width: '250px',
      data: {given: this.patient.contact[0].name.given[0], family: this.patient.contact[0].name.family,
      telephone: this.patient.contact[0].telecom[0].value}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.patient.contact[0].name.given[0] = result.given;
        this.patient.contact[0].name.family = result.family;
        this.patient.contact[0].telecom[0].value = result.telephone;
        this.fhirService.putPatient(this.patient)
          .subscribe((response: Patient) => {
            this.patient = response;
          });
      }
    });
  }

  openEditAllergiesDialog(allergy: AllergyIntolerance): void{
    const dialogRef = this.dialog.open(PatientEditAllergiesDialog, {
      width: '250px',
      data: {text: allergy.code.text, manifestation: allergy.reaction[0].manifestation[0].text,
        severity: allergy.reaction[0].severity, severityScale: ['mild', 'moderate', 'severe']}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        allergy.reaction[0].manifestation[0].text = result.manifestation;
        allergy.reaction[0].severity = result.severity;
        allergy.code.text = result.text;
        this.fhirService.updateAllergy(allergy)
          .subscribe(response => {
            this.getAllergies();
          });
      }
    });
  }

  openEditConditionsDialog(condition: Condition): void{
    const dialogRef = this.dialog.open(PatientEditConditionsDialog, {
      width: '250px',
      data: {text: condition.code.text}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined){
        condition.code.text = result.text;
        this.fhirService.updateCondition(condition)
          .subscribe(response => {
            this.getConditions();
          });
      }
    });
  }

  openEditMedicationDialog(med: {statement: MedicationStatement, medication: Medication}){
    const dialogRef = this.dialog.open(PatientEditMedicationDialog, {
      width: '250px',
      data: {medicationName: med.medication.code.text, dosage: med.statement.dosage[0].text}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined){
        med.statement.dosage[0].text = result.dosage;
        med.medication.code.text = result.medicationName;
        this.fhirService.putMedication(med.medication)
          .subscribe(response => {
            this.fhirService.putMedicationStatement(med.statement)
              .subscribe(statementResponse => {
                this.getMedication();
              });
          });
      }
    });
  }

}

@Component({
  selector: 'app-patient-body-data-dialog',
  templateUrl: 'patient-body-data-dialog.html',
})
export class PatientBodyDataDialog {

  constructor(
    public dialogRef: MatDialogRef<PatientBodyDataDialog>,
    @Inject(MAT_DIALOG_DATA) public data: BodyDialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-patient-edit-emergency-contact-dialog',
  templateUrl: 'patient-edit-emergency-contact-dialog.html',
})
export class PatientEditEmergencyContactDialog {

  constructor(
    public dialogRef: MatDialogRef<PatientEditEmergencyContactDialog>,
    @Inject(MAT_DIALOG_DATA) public data: EmergencyContactDialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-patient-edit-allergies-dialog',
  templateUrl: 'patient-edit-allergies-dialog.html',
})
export class PatientEditAllergiesDialog {

  constructor(
    public dialogRef: MatDialogRef<PatientEditAllergiesDialog>,
    @Inject(MAT_DIALOG_DATA) public data: EditAllergyDialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-patient-edit-conditions-dialog',
  templateUrl: 'patient-edit-conditions-dialog.html',
})
export class PatientEditConditionsDialog {

  constructor(
    public dialogRef: MatDialogRef<PatientEditConditionsDialog>,
    @Inject(MAT_DIALOG_DATA) public data: EditConditionDialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-patient-edit-medication-dialog',
  templateUrl: 'patient-edit-medication-dialog.html',
})
export class PatientEditMedicationDialog {

  constructor(
    public dialogRef: MatDialogRef<PatientEditMedicationDialog>,
    @Inject(MAT_DIALOG_DATA) public data: EditMedicationDialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
