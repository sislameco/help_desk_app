import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Demos } from './demos';

describe('Demos', () => {
  let component: Demos;
  let fixture: ComponentFixture<Demos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Demos],
    }).compileComponents();

    fixture = TestBed.createComponent(Demos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
