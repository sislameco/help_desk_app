import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditCustomField } from './add-edit-custom-field';

describe('AddEditCustomField', () => {
  let component: AddEditCustomField;
  let fixture: ComponentFixture<AddEditCustomField>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditCustomField],
    }).compileComponents();

    fixture = TestBed.createComponent(AddEditCustomField);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
