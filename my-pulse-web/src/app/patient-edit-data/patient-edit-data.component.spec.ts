import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientEditDataComponent } from './patient-edit-data.component';

describe('PatientEditDataComponent', () => {
  let component: PatientEditDataComponent;
  let fixture: ComponentFixture<PatientEditDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientEditDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientEditDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
