import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientDataSheetComponent } from './patient-data-sheet.component';

describe('PatientDataSheetComponent', () => {
  let component: PatientDataSheetComponent;
  let fixture: ComponentFixture<PatientDataSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientDataSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientDataSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
