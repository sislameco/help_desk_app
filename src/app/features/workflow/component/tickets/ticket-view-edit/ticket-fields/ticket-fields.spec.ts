import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketFields } from './ticket-fields';

describe('TicketFields', () => {
  let component: TicketFields;
  let fixture: ComponentFixture<TicketFields>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketFields],
    }).compileComponents();

    fixture = TestBed.createComponent(TicketFields);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
