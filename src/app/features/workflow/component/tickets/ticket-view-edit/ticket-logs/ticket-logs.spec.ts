import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketLogs } from './ticket-logs';

describe('TicketLogs', () => {
  let component: TicketLogs;
  let fixture: ComponentFixture<TicketLogs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketLogs],
    }).compileComponents();

    fixture = TestBed.createComponent(TicketLogs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
