import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketAttachment } from './ticket-attachment';

describe('TicketAttachment', () => {
  let component: TicketAttachment;
  let fixture: ComponentFixture<TicketAttachment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketAttachment],
    }).compileComponents();

    fixture = TestBed.createComponent(TicketAttachment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
