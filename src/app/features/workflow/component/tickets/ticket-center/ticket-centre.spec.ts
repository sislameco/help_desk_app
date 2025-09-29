import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketCentre } from './ticket-centre';

describe('TicketCentre', () => {
  let component: TicketCentre;
  let fixture: ComponentFixture<TicketCentre>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketCentre],
    }).compileComponents();

    fixture = TestBed.createComponent(TicketCentre);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
