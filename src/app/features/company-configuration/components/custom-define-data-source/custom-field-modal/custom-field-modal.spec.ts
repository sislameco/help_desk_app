import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomFieldModal } from './custom-field-modal';

describe('CustomFieldModal', () => {
  let component: CustomFieldModal;
  let fixture: ComponentFixture<CustomFieldModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomFieldModal],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomFieldModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
