import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationCode } from './verification-code';

describe('VerificationCode', () => {
  let component: VerificationCode;
  let fixture: ComponentFixture<VerificationCode>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerificationCode],
    }).compileComponents();

    fixture = TestBed.createComponent(VerificationCode);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
