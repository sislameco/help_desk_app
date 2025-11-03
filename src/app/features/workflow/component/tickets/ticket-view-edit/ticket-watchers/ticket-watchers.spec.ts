import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketWatchers } from './ticket-watchers';

describe('TicketWatchers', () => {
  let component: TicketWatchers;
  let fixture: ComponentFixture<TicketWatchers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketWatchers],
    }).compileComponents();

    fixture = TestBed.createComponent(TicketWatchers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
