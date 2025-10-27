import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordValidationItem } from './password-validation-item';

describe('PasswordValidationItem', () => {
  let component: PasswordValidationItem;
  let fixture: ComponentFixture<PasswordValidationItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordValidationItem],
    }).compileComponents();

    fixture = TestBed.createComponent(PasswordValidationItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
