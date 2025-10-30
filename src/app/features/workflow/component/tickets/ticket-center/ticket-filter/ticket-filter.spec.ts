import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketFilter } from './ticket-filter';

describe('TicketFilter', () => {
  let component: TicketFilter;
  let fixture: ComponentFixture<TicketFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketFilter],
    }).compileComponents();

    fixture = TestBed.createComponent(TicketFilter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
