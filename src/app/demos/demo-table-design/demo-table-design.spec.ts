import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoTableDesign } from './demo-table-design';

describe('DemoTableDesign', () => {
  let component: DemoTableDesign;
  let fixture: ComponentFixture<DemoTableDesign>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemoTableDesign],
    }).compileComponents();

    fixture = TestBed.createComponent(DemoTableDesign);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
