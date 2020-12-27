import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {PatientEditMedicationDialog, PatientEditConditionsDialog, PatientBodyDataDialog,
PatientEditAllergiesDialog, EditMedicationDialogData, EditConditionDialogData, EditAllergyDialogData,
BodyDialogData} from '../patient-data-sheet/patient-data-sheet.component';

@Component({
  selector: 'app-patient-edit-data',
  templateUrl: './patient-edit-data.component.html',
  styleUrls: ['./patient-edit-data.component.css']
})
export class PatientEditDataComponent implements OnInit {

  height;
  weight;
  validated = false;
  sliderHeightForm: FormGroup;
  sliderWeightForm: FormGroup;
  email = new FormControl('', [Validators.required, Validators.email]);


  constructor(@Inject(FormBuilder) public fb: FormBuilder) {
    this.weight = 80;
    this.height = 1.8;
    this.sliderHeightForm = this.fb.group({
      sliderHeight: [0, Validators.min(1.4)]
    });
    this.sliderWeightForm = this.fb.group({
      sliderWeight: [0, Validators.min(40)]
    });
  }

  updateWeight(event) {
    this.weight = event.value;
  }

  updateHeight(event) {
    this.height = event.value;
  }

  ngOnInit(): void {
  }


  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }
    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

}
