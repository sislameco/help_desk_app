import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonDesign } from './button-design';

describe('ButtonDesign', () => {
  let component: ButtonDesign;
  let fixture: ComponentFixture<ButtonDesign>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonDesign],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonDesign);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
